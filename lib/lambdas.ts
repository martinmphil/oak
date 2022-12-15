import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";

const commonProps = {
  bundling: { externalModules: ["aws-sdk"] },
  runtime: lambda.Runtime.NODEJS_16_X,
  architecture: lambda.Architecture.ARM_64,
};

export class LambdasOak extends Construct {
  public readonly candidateEmail: NodejsFunction;
  public readonly catalog: NodejsFunction;
  public readonly exam: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.candidateEmail = new NodejsFunction(this, "candidateEmailOak", {
      ...commonProps,
      entry: path.join(__dirname, `/handlers/candidate-email/index.ts`),
    });

    this.catalog = new NodejsFunction(this, "catalogOak", {
      ...commonProps,
      entry: path.join(__dirname, `/handlers/catalog/index.ts`),
    });

    this.exam = new NodejsFunction(this, "examOak", {
      ...commonProps,
      entry: path.join(__dirname, `/handlers/exam/index.ts`),
    });

    //
  }
}
