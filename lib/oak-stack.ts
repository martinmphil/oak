import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { HttpApi, HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

export class OakStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const canEmailAddrOak = new NodejsFunction(this, "canEmailAddrOak", {
      runtime: lambda.Runtime.NODEJS_16_X,
      architecture: lambda.Architecture.ARM_64,
      handler: "main",
      entry: path.join(__dirname, `/../src/can-email-addr-oak/index.ts`),
      bundling: { externalModules: ["aws-sdk"] },
    });
    const canEmailAddrIntegration = new HttpLambdaIntegration(
      "canEmailAddrIntegrationOak",
      canEmailAddrOak
    );

    const gatewayOak = new HttpApi(this, "gatewayOak", {
      // defaultAuthorizer: oakAuthorizor,
      corsPreflight: {
        allowHeaders: ["Authorization", "Content-Type"],
      },
    });
    gatewayOak.addRoutes({
      integration: canEmailAddrIntegration,
      methods: [HttpMethod.GET],
      path: "/email-addr",
    });
  }
}
