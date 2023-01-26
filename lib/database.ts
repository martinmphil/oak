import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as cdk from "aws-cdk-lib"
import { RetentionDays } from "aws-cdk-lib/aws-logs"
import { Construct } from "constructs"
import { seedArr } from "./seed"

export class DatabaseOak extends Construct {
  public readonly tableNameOak
  public readonly grantRead
  public readonly grantWrite

  constructor(scope: Construct, id: string) {
    super(scope, id)

    const table = new dynamodb.Table(this, "TableOak", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      // pointInTimeRecovery: true,
    })

    const requestItemsArr = seedArr.map((x) => {
      return { PutRequest: { Item: x } }
    })
    const parameters = {
      RequestItems: {
        [table.tableName]: requestItemsArr,
      },
    }
    new cdk.custom_resources.AwsCustomResource(this, "DynamoSeedData", {
      logRetention: RetentionDays.FIVE_DAYS,
      installLatestAwsSdk: true,
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
    })
    this.tableNameOak = table.tableName

    function grantRead(x: cdk.aws_iam.IGrantable) {
      return table.grantReadData(x)
    }
    this.grantRead = grantRead

    function grantWrite(x: cdk.aws_iam.IGrantable) {
      return table.grantReadWriteData(x)
    }
    this.grantWrite = grantWrite

    //
  }
}
