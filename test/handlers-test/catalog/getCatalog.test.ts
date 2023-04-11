import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import { getCatalog } from "../../../lib/handlers/catalog/getCatalog";

const candidateId = "candidate-dummy_username";

describe("get standard catalog", () => {
  const originalEnv = process.env;
  const dynamoMock = mockClient(DynamoDBDocumentClient);
  beforeEach(() => {
    process.env.DATABASE_NAME_OAK = "dummy_table_name";
    jest.resetModules();
    dynamoMock.reset();
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "catalog" },
      })
      .resolves({
        Item: { catalog: ["wflow1", "wflow2", "wflow3", "wflow4"] },
      });
  });
  afterEach(() => {
    jest.clearAllMocks();
    process.env = originalEnv;
    jest.resetModules();
    dynamoMock.reset();
  });

  it("asychronously returns a catalog array of workflow IDs", async () => {
    expect.assertions(2);
    const response = await getCatalog(candidateId);
    const result = Array.isArray(response) ? response : [];
    expect(Array.isArray(result)).toBe(true);
    expect(result[1]).toBe("wflow2");
  });

  it("returns [''] and warns the console if data is missing", () => {
    expect.assertions(4);
    console.warn = jest.fn();
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "catalog" },
      })
      .resolves({ Item: { message: "Internal server error" } });
    getCatalog(candidateId).then((catalog) => {
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
        Key: { pk: candidateId, sk: "catalog" },
      })
      .resolves({ Item: { catalog: "dummy_string" } });
    getCatalog(candidateId).then((catalog) => {
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(/databank.*failed.*catalog.*array/i)
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
        Key: { pk: candidateId, sk: "catalog" },
      })
      .resolves({ Item: { catalog: [] } });
    getCatalog(candidateId).then((catalog) => {
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
