import { updateSubmissions } from "../../../lib/handlers/workbook/updateSubmissions";

import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

describe("updateSubmissions", () => {
  const candidateId = "candidate-dummy_username";
  const workflowId = "workflow101";
  const worksheetId = "worksheet1";
  const candidateAnswer = "a1";

  const originalEnv = process.env;
  const dynamoMock = mockClient(DynamoDBDocumentClient);
  beforeEach(() => {
    process.env.DATABASE_NAME_OAK = "dummy_table_name";
    jest.resetModules();
    dynamoMock.reset();
    dynamoMock
      .on(UpdateCommand, {
        TableName: "dummy_table_name",
        Key: { pk: candidateId, sk: workflowId },
        UpdateExpression:
          "SET submissionsArr = list_append(submissionsArr, :submissionsAppend), updatedAt = :timestamp",
        ExpressionAttributeValues: {},
      })
      .resolves({
        Attributes: { submissionsArr: ["dummy_submission"] },
        $metadata: {
          httpStatusCode: 200,
          requestId: "DUMMY1",
          attempts: 1,
          totalRetryDelay: 0,
        },
      });
  });
  afterEach(() => {
    jest.resetModules();
    dynamoMock.reset();
    process.env = originalEnv;
  });

  it("exits", () => {
    expect(updateSubmissions).toBeDefined();
  });

  it("returns a promise", () => {
    expect.assertions(1);
    expect(
      updateSubmissions(candidateId, workflowId, worksheetId, candidateAnswer)
    ).resolves.not.toThrow();
  });

  it("returns $metadata", async () => {
    expect.assertions(1);
    const result = await updateSubmissions(
      candidateId,
      workflowId,
      worksheetId,
      candidateAnswer
    );
    expect(result.Attributes?.submissionsArr[0]).toMatch(/dummy_submission/i);
  });

  //
});
