// from @types
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

function nameTable() {
  const TableName = process.env.DATABASE_NAME_OAK;
  if (typeof TableName != "string" || TableName.length < 1) {
    throw new Error(` Missing database TableName. `);
  }
  return TableName;
}

export async function handler(event: APIGatewayProxyEventV2) {
  const client = new DynamoDBClient({ region: "eu-west-1" });
  const ddbDocClient = DynamoDBDocumentClient.from(client);

  const deleteCommand101 = new DeleteCommand({
    TableName: nameTable(),
    Key: {
      pk: "candidate-dc3f7580-b3cd-45f6-a6fd-321f992f1390",
      sk: "workflow101",
    },
    ReturnValues: "ALL_OLD",
  });

  const deleteCommand102 = new DeleteCommand({
    TableName: nameTable(),
    Key: {
      pk: "candidate-dc3f7580-b3cd-45f6-a6fd-321f992f1390",
      sk: "workflow102",
    },
    ReturnValues: "ALL_OLD",
  });

  const result101 = await ddbDocClient.send(deleteCommand101);
  const result102 = await ddbDocClient.send(deleteCommand102);

  return {
    body: `clear-test001 returned:- ${JSON.stringify(
      result101
    )} and ${JSON.stringify(result102)}`,
  };
}
