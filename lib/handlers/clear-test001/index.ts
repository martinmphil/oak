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

// also remove
// {pk: 'candidate-5639c5de-84d1-48b2-86b6-f39e3f359bd8', sk: 'workflow102'}
//

export async function handler(event: APIGatewayProxyEventV2) {
  const client = new DynamoDBClient({ region: "eu-west-1" });
  const ddbDocClient = DynamoDBDocumentClient.from(client);

  const deleteCommand = new DeleteCommand({
    TableName: nameTable(),
    Key: {
      pk: "candidate-5639c5de-84d1-48b2-86b6-f39e3f359bd8",
      sk: "workflow101",
    },
  });

  const result = await ddbDocClient.send(deleteCommand);

  return {
    body: `clear-test001 returned:- ${JSON.stringify(result)}`,
  };
}
