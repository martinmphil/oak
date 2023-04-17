import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import { getWorkflowTitle } from "../../../lib/handlers/listings/getWorkflowTitle";

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
    expect(getWorkflowTitle("wflow1")).toBeDefined();
  });

  it("returns a promise", () => {
    expect(getWorkflowTitle("wflow1")).toBeInstanceOf(Promise);
  });

  it("gets titles from databank", async () => {
    expect.assertions(2);
    expect(await getWorkflowTitle("wflow1")).toBe("title1");
    expect(await getWorkflowTitle("wflow2")).toBe("title2");
  });
});
