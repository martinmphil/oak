import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import { getWorkflowProgress } from "../../../lib/handlers/catalog/getWorkflowProgress";

describe("get work progress", () => {
  const candidateId = "candidate-dummy_username";

  const originalEnv = process.env;
  const dynamoMock = mockClient(DynamoDBDocumentClient);
  beforeEach(() => {
    process.env.DATABASE_NAME_OAK = "dummy_table_name";
    jest.resetModules();
    dynamoMock.reset();
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow1" },
      })
      .resolves({
        Item: { workProgress: 0 },
      });
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow2" },
      })
      .resolves({
        Item: { workProgress: 3 },
      });
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow3" },
      })
      .resolves({
        Item: { workProgress: -1 },
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

  it("returns a promise", () => {
    expect(getWorkflowProgress(candidateId, "wflow1")).toBeInstanceOf(Promise);
  });

  it("gets progression number from databank", async () => {
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
        Item: { workProgress: "4" },
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
        Item: { workProgress: "abc" },
      });
    expect(await getWorkflowProgress(candidateId, "wflow5")).toBe(0);
  });
});
