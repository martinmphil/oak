import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { DatabaseOak } from "./database";

const commonProps = {
  bundling: { externalModules: ["@aws-sdk/client-dynamodb", "@aws-sdk/lib-dynamodb"] },
  runtime: lambda.Runtime.NODEJS_18_X,
  architecture: lambda.Architecture.ARM_64,
};

export class LambdaOak extends Construct {
  public readonly candidateEmail: NodejsFunction;
  public readonly catalog: NodejsFunction;
  public readonly exam: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const database = new DatabaseOak(this, "DatabaseOak");

    const candidateEmail = new NodejsFunction(this, "CandidateEmailOak", {
      ...commonProps,
      entry: path.join(__dirname, `/handlers/candidate-email/index.ts`),
    });
    this.candidateEmail = candidateEmail;

    const catalog = new NodejsFunction(this, "CatalogOak", {
      ...commonProps,
      entry: path.join(__dirname, `/handlers/catalog/index.ts`),
      environment: {
        DATABASE_NAME_OAK: database.tableNameOak,
      },
    });
    database.grantRead(catalog);
    this.catalog = catalog;

    const exam = new NodejsFunction(this, "ExamOak", {
      ...commonProps,
      entry: path.join(__dirname, `/handlers/exam/index.ts`),
    });
    this.exam = exam;

    //
  }
}
