import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({ region: 'eu-west-1' })
const ddbDocClient = DynamoDBDocumentClient.from(client)

const TableName = process.env.DATABASE_NAME_OAK
if (typeof (TableName) != 'string' || TableName.length < 1) {
    throw (new Error(` Missing database table-name. `))
}

export async function getItem(pk: string, sk: string) {
    const getParams = {
        TableName,
        Key: {
            pk,
            sk
        }
    }
    const data = await ddbDocClient
        .send(new GetCommand(getParams))
        .catch((err) => {
            throw new
                Error(`Database failed to get data ${getParams}. Error ${err}`)
        })
    const itemObj = data?.Item
    if (itemObj === undefined || itemObj === null || JSON.stringify(itemObj) === '{}') {
        throw new Error(`Database failed to get item pk:${pk}, sk:${sk}.`)
    }
    return itemObj
}

export async function putItem(pk: string, sk: string, payload: any) {
    let Item = payload
    Item.pk = pk
    Item.sk = sk
    const putParams = {
        TableName,
        Item
    }
    const data = await ddbDocClient
        .send(new PutCommand(putParams))
        .catch((err) => {
            throw new
                Error(`Database failed to put data ${putParams}. Error ${err}`)
        })
    return data
}