import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { IItem } from "./dynamo_interface";

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
      throw new Error(
        `Database failed to get data ${JSON.stringify(getParams)}. Error ${err}`
      );
    });
  const itemObj = data?.Item;
  if (
    itemObj === undefined ||
    itemObj === null ||
    JSON.stringify(itemObj) === "{}"
  ) {
    throw new Error(
      `Database failed to get item ${JSON.stringify(getParams)}.`
    );
  }
  return itemObj;
}

export async function putItem(Item: IItem) {
  const putParams = {
    TableName: nameTable(),
    Item,
  };
  const responce = await ddbDocClient
    .send(new PutCommand(putParams))
    .catch((err) => {
      throw new Error(
        `Database failed to put data ${JSON.stringify(putParams)}. Error ${err}`
      );
    });
  return responce;
}
