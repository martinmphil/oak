import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class DatabaseOak extends Construct {
  // public readonly

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const table = new dynamodb.Table(this, "TableOak", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      // pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new cdk.custom_resources.AwsCustomResource(this, "dynamoSeedData", {
      onCreate: {
        service: "DynamoDB",
        action: "putItem",
        parameters: {
          TableName: table.tableName,
          Item: {
            pk: { S: "My partiion key" },
            sk: { S: "My sort key" },
          },
        },
        physicalResourceId: cdk.custom_resources.PhysicalResourceId.of(
          Date.now().toString()
        ),
      },
      policy: cdk.custom_resources.AwsCustomResourcePolicy.fromSdkCalls({
        resources: [table.tableArn],
      }),
    });

    // console.log("table name 👉", table.tableName);
    // console.log("table arn 👉", table.tableArn);

    //
  }
}
