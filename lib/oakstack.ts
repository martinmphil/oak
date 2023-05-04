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
          "https://main.d3dq4xzxmmo3wf.amplifyapp.com",
          "http://localhost:5173",
        ],
        allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.POST],
      },
    });
    new cdk.CfnOutput(this, "GatewayUrl", {
      value: gateway.apiEndpoint,
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

    const listings = new NodejsFunction(this, "ListingsOak", {
      ...lambdaCommonProps,
      entry: path.join(__dirname, `/handlers/listings/index.ts`),
      environment: {
        DATABASE_NAME_OAK: database.tableNameOak,
      },
    });
    database.grantRead(listings);
    const listingsIntegration = new HttpLambdaIntegration(
      "ListingsIntegrationOak",
      listings
    );
    new LogGroup(this, "LogGroupListingsOak", {
      logGroupName: `/aws/lambda/${listings.functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    gateway.addRoutes({
      integration: listingsIntegration,
      methods: [HttpMethod.GET],
      path: "/listings",
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
      methods: [HttpMethod.POST],
      path: "/workbook/{workflowId}",
    });

    const clearTest001 = new NodejsFunction(this, "clearTest001Oak", {
      ...lambdaCommonProps,
      entry: path.join(__dirname, `/handlers/clear-test001/index.ts`),
      environment: {
        DATABASE_NAME_OAK: database.tableNameOak,
      },
    });
    database.grantWrite(clearTest001);
    new LogGroup(this, "LogGroupClearTest001", {
      logGroupName: `/aws/lambda/${clearTest001.functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    //
  }
}
