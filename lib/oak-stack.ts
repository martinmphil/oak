import * as path from "path";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { HttpUserPoolAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { DatabaseOak } from "./database";
import { CognitoOak } from "./auth";
import { lambdaCommonProps } from "./fixtures/lambdaCommonProps";

export class OakStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new DatabaseOak(this, "DatabaseOak");

    const cognitoOak = new CognitoOak(this, "CognitoOak", {
      tableNameOak: database.tableNameOak,
    });
    const canAuthOak = new HttpUserPoolAuthorizer(
      "defaultAuthorizer",
      cognitoOak.userPool,
      { userPoolClients: [cognitoOak.userPoolClient] }
    );
    database.grantWrite(cognitoOak.cognitoPostConfirm);

    const gateway = new HttpApi(this, "GatewayOak", {
      defaultAuthorizer: canAuthOak,
      corsPreflight: {
        allowHeaders: ["Authorization"],
        allowOrigins: [
          "https://main.d3dq4xzxmmo3wf.amplifyapp.com/",
          "http://localhost:6100",
        ],
        allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.PUT],
      },
    });

    const candidateEmail = new NodejsFunction(this, "CandidateEmailOak", {
      ...lambdaCommonProps,
      entry: path.join(__dirname, `/handlers/candidate-email/index.ts`),
    });
    const candidateEmailIntegration = new HttpLambdaIntegration(
      "CandidateEmailIntegrationOak",
      candidateEmail
    );
    new LogGroup(this, "LogGroupCandidateEmailOak", {
      logGroupName: `/aws/lambda/${candidateEmail.functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    gateway.addRoutes({
      integration: candidateEmailIntegration,
      methods: [HttpMethod.GET],
      path: "/candidate-email",
    });

    const catalog = new NodejsFunction(this, "CatalogOak", {
      ...lambdaCommonProps,
      entry: path.join(__dirname, `/handlers/catalog/index.ts`),
      environment: {
        DATABASE_NAME_OAK: database.tableNameOak,
      },
    });
    database.grantRead(catalog);
    const catalogIntegration = new HttpLambdaIntegration(
      "CatalogIntegrationOak",
      catalog
    );
    new LogGroup(this, "LogGroupCatalogOak", {
      logGroupName: `/aws/lambda/${catalog.functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    gateway.addRoutes({
      integration: catalogIntegration,
      methods: [HttpMethod.GET],
      path: "/catalog",
    });

    const workbook = new NodejsFunction(this, "WorkbookOak", {
      ...lambdaCommonProps,
      entry: path.join(__dirname, `/handlers/workbook/index.ts`),
      environment: {
        DATABASE_NAME_OAK: database.tableNameOak,
      },
    });
    database.grantWrite(workbook);
    const workbookIntegration = new HttpLambdaIntegration(
      "WorkbookIntegrationOak",
      workbook
    );
    new LogGroup(this, "LogGroupWorkbookOak", {
      logGroupName: `/aws/lambda/${workbook.functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    gateway.addRoutes({
      integration: workbookIntegration,
      methods: [HttpMethod.PUT],
      path: "/workbook/{workflowId}",
    });

    //
  }
}
