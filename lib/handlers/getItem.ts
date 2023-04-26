import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

function nameTable() {
  const TableName = process.env.DATABASE_NAME_OAK;
  if (typeof TableName != "string" || TableName.length < 1) {
    throw new Error(` Missing database table-name. `);
  }
  return TableName;
}

export async function getItem(pk: string, sk: string) {
  const getParams = {
    TableName: nameTable(),
    Key: {
      pk,
      sk,
    },
  };
  const data = await ddbDocClient
    .send(new GetCommand(getParams))
    .catch((err) => {
      let fault = `Database failed to get data:- ${JSON.stringify(
        getParams
      )}. `;
      if (err) {
        fault += `Get-command error:- ${err} `;
      }
      throw new Error(fault);
    });
  const itemObj = data?.Item;
  return itemObj;
}
