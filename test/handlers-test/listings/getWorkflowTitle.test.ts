import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import { getWorkflowTitle } from "../../../lib/handlers/getWorkflowTitle";

describe("get works=flow title modukle", () => {
  const originalEnv = process.env;
  const dynamoMock = mockClient(DynamoDBDocumentClient);
  beforeEach(() => {
    process.env.DATABASE_NAME_OAK = "dummy_table_name";
    jest.resetModules();
    dynamoMock.reset();
    dynamoMock
      .on(GetCommand, {
        Key: { pk: "wflow1", sk: "wflow1" },
      })
      .resolves({
        Item: { workflowTitle: "title1" },
      });
    dynamoMock
      .on(GetCommand, {
        Key: { pk: "wflow2", sk: "wflow2" },
      })
      .resolves({
        Item: { workflowTitle: "title2" },
      });
  });
  afterEach(() => {
    jest.clearAllMocks();
    process.env = originalEnv;
    jest.resetModules();
    dynamoMock.reset();
  });

  it("exists", () => {
    expect(getWorkflowTitle).toBeDefined();
  });

  it("gets titles from databank", async () => {
    expect.assertions(2);
    expect(await getWorkflowTitle("wflow1")).toBe("title1");
    expect(await getWorkflowTitle("wflow2")).toBe("title2");
  });

  it("returns workflow title for empty repsonse", async () => {
    expect.assertions(1);
    dynamoMock
      .on(GetCommand, {
        Key: { pk: "wflow3", sk: "wflow3" },
      })
      .resolves({
        Item: {},
      });
    expect(await getWorkflowTitle("wflow3")).toBe("wflow3");
  });

  it("warns and returns zero if get-item fails", async () => {
    expect.assertions(3);
    console.warn = jest.fn();
    dynamoMock.on(GetCommand).rejects(new Error("get-item-failed"));
    await getWorkflowTitle("wflow4").then((response) => {
      expect(response).toBe("wflow4");
    });
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/get-item-failed/)
    );
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/Database failed to get data/i)
    );
  });
});
