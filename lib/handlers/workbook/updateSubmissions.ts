import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const ddbDocClient = DynamoDBDocumentClient.from(client);

function nameTable() {
  const TableName = process.env.DATABASE_NAME_OAK;
  if (typeof TableName != "string" || TableName.length < 1) {
    throw new Error(` Missing database TableName. `);
  }
  return TableName;
}

export async function updateSubmissions(
  candidateId: string,
  workflowId: string,
  worksheetId: string,
  candidateAnswer: string
) {
  try {
    const TableName = nameTable();
    const timestamp = new Date().toISOString();

    const submissionsAppend = [
      {
        worksheetId,
        candidateAnswer,
        submitDate: timestamp,
      },
    ];

    const params = {
      TableName,
      Key: {
        pk: candidateId,
        sk: workflowId,
      },
      UpdateExpression:
        "SET submissionsArr = list_append(submissionsArr, :submissionsAppend), updatedAt = :timestamp",
      ExpressionAttributeValues: {
        ":submissionsAppend": submissionsAppend,
        ":timestamp": timestamp,
      },
    };
    const data = await ddbDocClient.send(new UpdateCommand(params));

    return data;
  } catch (err) {
    throw new Error(
      ` Failed to updateOngoing(${candidateId}, ${workflowId}):- ${err} `
    );
  }
}
