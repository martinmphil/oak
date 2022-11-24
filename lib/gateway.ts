import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as logs from "aws-cdk-lib/aws-logs";
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

export interface gatewayProps {
  //insert properties you wish to expose
}

export class gateway extends Construct {
  constructor(scope: Construct, id: string, props: gatewayProps = {}) {
    super(scope, id);

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

    const gateway = new HttpApi(this, "gateway", {
      corsPreflight: {
        allowHeaders: ["Authorization"],
        allowOrigins: [
          "https://main.d3dq4xzxmmo3wf.amplifyapp.com/",
          "http://localhost:6100",
        ],
        allowMethods: [CorsHttpMethod.GET],
      },
    });
    gateway.addRoutes({
      integration: canEmailAddrIntegration,
      methods: [HttpMethod.GET],
      path: "/email-addr",
    });
  }
}
