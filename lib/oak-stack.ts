import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export class OakStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const canEmailAddrOak = new NodejsFunction(this, "canEmailAddrOak", {
      runtime: lambda.Runtime.NODEJS_16_X,
      // architecture: lambda.Architecture.ARM_64,
      handler: "main",
      entry: path.join(__dirname, `/../src/can-email-addr-oak/index.ts`),
      bundling: { externalModules: ["aws-sdk"] },
    });
  }
}
