import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import { getWorkflowProgress } from "../../../lib/handlers/listings/getWorkflowProgress";

describe("get work progress", () => {
  const candidateId = "candidate-dummy_username";

  const originalEnv = process.env;
  const dynamoMock = mockClient(DynamoDBDocumentClient);
  beforeEach(() => {
    console.warn = jest.fn();
    process.env.DATABASE_NAME_OAK = "dummy_table_name";
    jest.resetModules();
    dynamoMock.reset();
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow1" },
      })
      .resolves({
        Item: { workflowProgress: 0 },
      });
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow2" },
      })
      .resolves({
        Item: { workflowProgress: 3 },
      });
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow3" },
      })
      .resolves({
        Item: { workflowProgress: -1 },
      });
  });
  afterEach(() => {
    jest.clearAllMocks();
    process.env = originalEnv;
    jest.resetModules();
    dynamoMock.reset();
  });

  it("exists", () => {
    expect(getWorkflowProgress(candidateId, "wflow1")).toBeDefined();
  });

  it("gets workflowProgress number from databank", async () => {
    expect.assertions(3);
    expect(await getWorkflowProgress(candidateId, "wflow1")).toBe(0);
    expect(await getWorkflowProgress(candidateId, "wflow2")).toBe(3);
    expect(await getWorkflowProgress(candidateId, "wflow3")).toBe(-1);
  });

  it("converts a strings to numbers", async () => {
    expect.assertions(1);
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow4" },
      })
      .resolves({
        Item: { workflowProgress: "4" },
      });

    expect(await getWorkflowProgress(candidateId, "wflow4")).toBe(4);
  });

  it("returns zero for non-number strings", async () => {
    expect.assertions(1);
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow5" },
      })
      .resolves({
        Item: { workflowProgress: "abc" },
      });
    expect(await getWorkflowProgress(candidateId, "wflow5")).toBe(0);
  });

  it("warns and returns zero if get-item fails", async () => {
    expect.assertions(4);
    dynamoMock.on(GetCommand).rejects(new Error("getItem failed"));
    await getWorkflowProgress(candidateId, "wflow1").then((response) => {
      expect(response).toBe(0);
    });
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/getWorkflowProgress/)
    );
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/getItem failed/)
    );
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/Database failed to get data/i)
    );
  });
});
