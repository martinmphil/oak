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
import { LambdaOak } from "./lambda";
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

    const lambdaOak = new LambdaOak(this, "LambdaOak");

    const candidateEmailIntegration = new HttpLambdaIntegration(
      "CandidateEmailIntegrationOak",
      lambdaOak.candidateEmail
    );
    new logs.LogGroup(this, "LogGroupCandidateEmailOak", {
      logGroupName: `/aws/lambda/${lambdaOak.candidateEmail.functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    gateway.addRoutes({
      integration: candidateEmailIntegration,
      methods: [HttpMethod.GET],
      path: "/candidate-email",
    });

    const catalogIntegration = new HttpLambdaIntegration(
      "CatalogIntegrationOak",
      lambdaOak.catalog
    );
    new logs.LogGroup(this, "LogGroupCatalogOak", {
      logGroupName: `/aws/lambda/${lambdaOak.catalog.functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    gateway.addRoutes({
      integration: catalogIntegration,
      methods: [HttpMethod.GET],
      path: "/catalog",
    });

    const examIntegration = new HttpLambdaIntegration(
      "ExamIntegrationOak",
      lambdaOak.exam
    );
    new logs.LogGroup(this, "LogGroupExamOak", {
      logGroupName: `/aws/lambda/${lambdaOak.exam.functionName}`,
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
