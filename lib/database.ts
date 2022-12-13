import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { seedArr } from "./seed";

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

    const requestItemsArr = seedArr.map((x) => {
      return { PutRequest: { Item: x } };
    });
    const parameters = {
      RequestItems: {
        [table.tableName]: requestItemsArr,
      },
    };
    new cdk.custom_resources.AwsCustomResource(this, "dynamoSeedData", {
      onCreate: {
        service: "DynamoDB",
        action: "batchWriteItem",
        parameters,
        physicalResourceId: cdk.custom_resources.PhysicalResourceId.of(
          `${table.tableName} seeded}`
        ),
      },
      policy: cdk.custom_resources.AwsCustomResourcePolicy.fromSdkCalls({
        resources: [table.tableArn],
      }),
    });

    //
  }
}
