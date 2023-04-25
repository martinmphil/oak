import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import { getCatalog } from "../../../lib/handlers/listings/getCatalog";

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

  it("exists", () => {
    expect(getCatalog).toBeDefined();
  });

  it("asychronously returns a catalog as workflow id array", () => {
    expect.assertions(2);
    getCatalog(candidateId).then((response) => {
      expect(Array.isArray(response)).toBe(true);
      expect(response[1]).toBe("wflow2");
    });
  });

  it("throws an error if data is missing", () => {
    expect.assertions(2);
    console.warn = jest.fn();
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "catalog" },
      })
      .resolves({ Item: {} });

    getCatalog(candidateId).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/malformed array of strings/i);
    });
  });

  it("throws an error if data is not array", () => {
    expect.assertions(2);
    console.warn = jest.fn();
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "catalog" },
      })
      .resolves({ Item: { catalog: "dummy_string" } });

    getCatalog(candidateId).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/malformed array of strings/i);
    });
  });

  it("throws an error if data is an empty array", () => {
    expect.assertions(2);
    console.warn = jest.fn();
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "catalog" },
      })
      .resolves({ Item: { catalog: [] } });

    getCatalog(candidateId).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/malformed array of strings/i);
    });
  });

  //
});
