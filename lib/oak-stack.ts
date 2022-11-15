import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as logs from "aws-cdk-lib/aws-logs";
import {
  HttpApi,
  HttpMethod,
  CorsHttpMethod,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

export class OakStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // lambda
    const canEmailAddrOak = new NodejsFunction(this, "canEmailAddrOak", {
      runtime: lambda.Runtime.NODEJS_16_X,
      architecture: lambda.Architecture.ARM_64,
      handler: "main",
      entry: path.join(__dirname, `/../src/can-email-addr-oak/index.ts`),
      bundling: { externalModules: ["aws-sdk"] },
    });

    new logs.LogGroup(this, "logGroupCanEmailAddrOak", {
      logGroupName: `/aws/lambda/${canEmailAddrOak.functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const canEmailAddrIntegration = new HttpLambdaIntegration(
      "canEmailAddrIntegrationOak",
      canEmailAddrOak
    );

    // gateway
    const gatewayOak = new HttpApi(this, "gatewayOak", {
      // defaultAuthorizer: oakAuthorizor,
      corsPreflight: {
        allowHeaders: ["Authorization"],
        allowOrigins: [
          "https://main.d3dq4xzxmmo3wf.amplifyapp.com/",
          "http://localhost:6100",
        ],
        allowMethods: [CorsHttpMethod.GET],
      },
    });
    gatewayOak.addRoutes({
      integration: canEmailAddrIntegration,
      methods: [HttpMethod.GET],
      path: "/email-addr",
    });
  }
}
