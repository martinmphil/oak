import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

function nameTable() {
  const TableName = process.env.DATABASE_NAME_OAK;
  if (typeof TableName != "string" || TableName.length < 1) {
    throw new Error(` Missing database table-name. `);
  }
  return TableName;
}

export async function submitting() {
  const updateParams = {
    TableName: nameTable(),
    Key: { pk: "dummyPk", sk: "dummySk" },
  };

  const response = await ddbDocClient
    .send(new UpdateCommand(updateParams))
    .catch((err) => {
      const fault = `Database failed to update databse with ${JSON.stringify(
        updateParams
      )} :- ${err} `;
      throw new Error(fault);
    });

  //
}
