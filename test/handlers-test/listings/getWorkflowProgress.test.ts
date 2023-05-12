import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import { getWorkflowProgress } from "../../../lib/handlers/listings/getWorkflowProgress";

const candidateId = "candidate-dummy_username";
const workflowId = "workflow101";

const achievedAssessmentData = {
  pk: candidateId,
  sk: workflowId,
  entityType: "assessmentData",
  workflow: ["worksheet1", "worksheet2", "worksheet3"],
  submissionsArr: [
    { worksheetId: "worksheet1", candidateAnswer: "a1" },
    { worksheetId: "worksheet2", candidateAnswer: "a1" },
    { worksheetId: "worksheet3", candidateAnswer: "a1" },
  ],
};

const ongoingAssessmentData = {
  pk: candidateId,
  sk: workflowId,
  entityType: "assessmentData",
  workflow: ["worksheet1", "worksheet2", "worksheet3"],
  submissionsArr: [{ worksheetId: "worksheet1", candidateAnswer: "a3" }],
};

describe("getWorkflowProgress", () => {
  const originalEnv = process.env;
  const dynamoMock = mockClient(DynamoDBDocumentClient);
  beforeEach(() => {
    console.warn = jest.fn();
    jest.resetModules();
    dynamoMock.reset();
    process.env.DATABASE_NAME_OAK = "dummy_table_name";
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    dynamoMock.reset();
    process.env = originalEnv;
  });

  it("returns upcoming when assessmentData is empty", async () => {
    expect.assertions(1);
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: workflowId },
      })
      .resolves({
        Item: {},
      });
    expect(await getWorkflowProgress(candidateId, workflowId)).toBe("upcoming");
  });

  it("returns upcoming when assessmentData is undefined", async () => {
    expect.assertions(1);
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: workflowId },
      })
      // @ts-ignore
      .resolves(undefined);
    expect(await getWorkflowProgress(candidateId, workflowId)).toBe("upcoming");
  });

  it("returns achieved with achieved assessmentData", async () => {
    expect.assertions(1);
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: workflowId },
      })
      .resolves({
        Item: achievedAssessmentData,
      });
    expect(await getWorkflowProgress(candidateId, workflowId)).toBe("achieved");
  });

  it("returns ongoing with ongoing assessmentData", async () => {
    expect.assertions(1);
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: workflowId },
      })
      .resolves({
        Item: ongoingAssessmentData,
      });
    expect(await getWorkflowProgress(candidateId, workflowId)).toBe("ongoing");
  });

  it("it returns upcoming with malformed assessmentData", async () => {
    expect.assertions(1);
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: workflowId },
      })
      .resolves({
        Item: ["malformed_assessment_data"],
      });
    expect(await getWorkflowProgress(candidateId, workflowId)).toBe("upcoming");
  });

  it("it warns and returns upcoming if getItem fails", async () => {
    expect.assertions(3);
    dynamoMock.on(GetCommand).rejects(new Error("getItem failed"));
    expect(await getWorkflowProgress(candidateId, workflowId)).toBe("upcoming");
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/getWorkflowProgress/)
    );
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/getItem failed/)
    );
  });

  //
});
