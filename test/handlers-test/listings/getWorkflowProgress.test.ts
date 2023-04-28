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
        Item: {},
      });
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow2" },
      })
      .resolves({
        Item: { workflowIndex: 3 },
      });
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow3" },
      })
      .resolves({
        Item: { workflowIndex: -1 },
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

  it("gets workflowIndex string from databank", async () => {
    expect.assertions(3);
    expect(await getWorkflowProgress(candidateId, "wflow1")).toBe("upcoming");
    expect(await getWorkflowProgress(candidateId, "wflow2")).toBe("ongoing");
    expect(await getWorkflowProgress(candidateId, "wflow3")).toBe("achieved");
  });

  it("converts a strings to numbers", async () => {
    expect.assertions(1);
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow4" },
      })
      .resolves({
        Item: { workflowIndex: "4" },
      });

    expect(await getWorkflowProgress(candidateId, "wflow4")).toBe("upcoming");
  });

  it("returns zero for non-number strings", async () => {
    expect.assertions(1);
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow5" },
      })
      .resolves({
        Item: { workflowIndex: "abc" },
      });
    expect(await getWorkflowProgress(candidateId, "wflow5")).toBe("upcoming");
  });

  it("warns and returns zero if get-item fails", async () => {
    expect.assertions(4);
    dynamoMock.on(GetCommand).rejects(new Error("getItem failed"));
    await getWorkflowProgress(candidateId, "wflow1").then((response) => {
      expect(response).toBe("upcoming");
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
