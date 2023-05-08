import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { TItem, IPutParams } from "./dynamoInterface";

const client = new DynamoDBClient({ region: "eu-west-1" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

function nameTable() {
  const TableName = process.env.DATABASE_NAME_OAK;
  if (typeof TableName != "string" || TableName.length < 1) {
    throw new Error(` Missing database TableName. `);
  }
  return TableName;
}

export async function putItem(Item: TItem, ConditionExpression?: string) {
  const putParams: IPutParams = {
    TableName: nameTable(),
    Item,
  };

  if (
    ConditionExpression &&
    typeof ConditionExpression === "string" &&
    ConditionExpression.length > 0
  ) {
    putParams.ConditionExpression = ConditionExpression;
  }

  const response = await ddbDocClient
    .send(new PutCommand(putParams))
    .catch((err) => {
      let fault = `Database failed to put data:- ${JSON.stringify(
        putParams
      )}. `;
      if (err) {
        fault += `Put-command error:- ${err} `;
      }
      throw new Error(fault);
    });
  return response;
}
