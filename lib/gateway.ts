import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as logs from "aws-cdk-lib/aws-logs";
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { HttpUserPoolAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { LambdasOak } from "./lambdas";
import { CognitoOak } from "./cognito";

export class gateway extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const cognitoOak = new CognitoOak(this, "CognitoOak");
    const canAuthOak = new HttpUserPoolAuthorizer(
      "defaultAuthorizer",
      cognitoOak.userPool,
      { userPoolClients: [cognitoOak.userPoolClient] }
    );

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

    const lambdasOak = new LambdasOak(this, "LambdasOak");

    const canEmailAddrIntegration = new HttpLambdaIntegration(
      "CanEmailAddrIntegrationOak",
      lambdasOak.canEmailAddr
    );
    new logs.LogGroup(this, "LogGroupCanEmailAddrOak", {
      logGroupName: `/aws/lambda/${lambdasOak.canEmailAddr.functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    gateway.addRoutes({
      integration: canEmailAddrIntegration,
      methods: [HttpMethod.GET],
      path: "/can-email-addr",
    });

    const catalogIntegration = new HttpLambdaIntegration(
      "CatalogIntegrationOak",
      lambdasOak.catalog
    );
    new logs.LogGroup(this, "LogGroupCatalogOak", {
      logGroupName: `/aws/lambda/${lambdasOak.catalog.functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    gateway.addRoutes({
      integration: catalogIntegration,
      methods: [HttpMethod.GET],
      path: "/catalog",
    });

    const examIntegration = new HttpLambdaIntegration(
      "ExamIntegrationOak",
      lambdasOak.exam
    );
    new logs.LogGroup(this, "LogGroupExamOak", {
      logGroupName: `/aws/lambda/${lambdasOak.exam.functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    gateway.addRoutes({
      integration: examIntegration,
      methods: [HttpMethod.PUT],
      path: "/exam/{examId}",
    });

    //
  }
}
