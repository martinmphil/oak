import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";


const client = new DynamoDBClient({ region: 'eu-west-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const TableName = process.env.DATABASE_NAME_OAK;
if (typeof (TableName) != 'string' || TableName.length < 1) {
    throw (new Error(` Missing database table-name. `))
}

export async function getItem(pk: string, sk: string) {
    const params = {
        TableName,
        Key: {
            pk,
            sk
        }
    }
    const data = await ddbDocClient
        .send(new GetCommand(params))
        .catch((err) => {
            throw new
                Error(`Database failed to get data for pk:${pk}, sk:${sk}. Error ${err}`)
        })
    const itemObj = data?.Item
    if (itemObj === undefined || itemObj === null || JSON.stringify(itemObj) === '{}') {
        throw new Error(`Database failed to get item pk:${pk}, sk:${sk}.`)
    }
    return itemObj

}