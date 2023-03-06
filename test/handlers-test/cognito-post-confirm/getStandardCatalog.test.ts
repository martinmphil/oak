import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import { getStandardCatalog } from "../../../lib/handlers/cognito-post-confirm/getStandardCatalog";

describe("get standard catalog", () => {
  const originalEnv = process.env;
  const dynamoMock = mockClient(DynamoDBDocumentClient);
  beforeEach(() => {
    process.env.DATABASE_NAME_OAK = "dummy_table_name";
    jest.resetModules();
    dynamoMock.reset();
    dynamoMock
      .on(GetCommand, {
        Key: { pk: "standardCatalog", sk: "standardCatalog" },
      })
      .resolves({ Item: { catalog: ["exam1", "exam2"] } });
  });
  afterEach(() => {
    jest.clearAllMocks();
    process.env = originalEnv;
    jest.resetModules();
    dynamoMock.reset();
  });

  it("asychronously returns a standard catalog array of workflow IDs", async () => {
    expect.assertions(2);
    const response = await getStandardCatalog();
    const result = Array.isArray(response) ? response : [];
    expect(Array.isArray(result)).toBe(true);
    expect(result[1]).toBe("exam2");
  });

  it("returns [''] and warns the console if data is missing", () => {
    expect.assertions(4);
    console.warn = jest.fn();
    dynamoMock
      .on(GetCommand, {
        Key: { pk: "standardCatalog", sk: "standardCatalog" },
      })
      .resolves({ Item: { message: "Internal server error" } });
    getStandardCatalog().then((catalog) => {
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(/failed.*catalog/i)
      );
      expect(Array.isArray(catalog)).toBe(true);
      expect(typeof catalog[0]).toBe("string");
      expect(catalog[0].length).toBe(0);
    });
  });

  it("returns [''] and warns the console if data is not array", () => {
    expect.assertions(4);
    console.warn = jest.fn();
    dynamoMock
      .on(GetCommand, {
        Key: { pk: "standardCatalog", sk: "standardCatalog" },
      })
      .resolves({ Item: { catalog: "exam2" } });
    getStandardCatalog().then((catalog) => {
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(/database.*failed.*standard.*catalog.*array/i)
      );
      expect(Array.isArray(catalog)).toBe(true);
      expect(typeof catalog[0]).toBe("string");
      expect(catalog[0].length).toBe(0);
    });
  });

  it("returns [''] and warns the console if data is an empty array", () => {
    expect.assertions(4);
    console.warn = jest.fn();
    dynamoMock
      .on(GetCommand, {
        Key: { pk: "standardCatalog", sk: "standardCatalog" },
      })
      .resolves({ Item: { catalog: [] } });
    getStandardCatalog().then((catalog) => {
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(/empty array/i)
      );
      expect(Array.isArray(catalog)).toBe(true);
      expect(typeof catalog[0]).toBe("string");
      expect(catalog[0].length).toBe(0);
    });
  });

  //
});
