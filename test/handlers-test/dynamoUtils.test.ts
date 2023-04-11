import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { getItem, putItem } from "../../lib/handlers/dynamoUtils";

describe("get-item function", () => {
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
      .resolves({
        Item: { catalog: ["wflow1", "wflow2", "wflow3", "wflow4"] },
      });
  });
  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
    dynamoMock.reset();
  });

  it("exists", async () => {
    expect.assertions(1);
    const Item = await getItem("standardCatalog", "standardCatalog");
    if (Item) {
      expect(Item.catalog[0]).toStrictEqual("wflow1");
    }
  });
  it("throws an error when missing a table name", () => {
    expect.assertions(2);
    process.env.DATABASE_NAME_OAK = "";
    getItem("standardCatalog", "standardCatalog").catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch("Missing database table-name");
    });
  });
  it("throws a meaningful error when promise rejects", async () => {
    expect.assertions(2);
    dynamoMock
      .on(GetCommand, {
        Key: { pk: "rejects", sk: "rejects" },
      })
      .rejects();
    getItem("rejects", "rejects").catch((err) => {
      expect(err.message).toMatch(/Database failed to get data/i);
      expect(err.message).toMatch(/dummy_table_name.*pk.*rejects/i);
    });
  });
  it("handles undefined when item is missing from databank", async () => {
    expect.assertions(1);
    dynamoMock
      .on(GetCommand, {
        Key: { pk: "undefined", sk: "undefined" },
      })
      .resolves({
        Item: undefined,
      });
    getItem("undefined", "undefined").then((x) => {
      console.log(x);
      expect(x).toBeUndefined();
    });
  });

  //
});

describe("put-item function", () => {
  const originalEnv = process.env;
  const dynamoMock = mockClient(DynamoDBDocumentClient);
  beforeEach(() => {
    process.env.DATABASE_NAME_OAK = "dummy_table_name";
    jest.resetModules();
    dynamoMock.reset();
    dynamoMock
      .on(PutCommand, {
        Item: { pk: "dummyPk", sk: "dummySk", updatedAt: "dummyValue" },
      })
      .resolves({
        $metadata: {
          httpStatusCode: 200,
          requestId: "DUMMY1",
          attempts: 1,
          totalRetryDelay: 0,
        },
      });
  });
  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
    dynamoMock.reset();
  });
  it("exists", async () => {
    expect.assertions(1);
    const response = await putItem({
      pk: "dummyPk",
      sk: "dummySk",
      updatedAt: "dummyValue",
    });
    expect(response["$metadata"]).toHaveProperty("httpStatusCode", 200);
  });
  it("throws an error when missing a table name", () => {
    expect.assertions(2);
    process.env.DATABASE_NAME_OAK = "";
    putItem({
      pk: "dummyPk",
      sk: "dummySk",
      updatedAt: "dummyValue",
    }).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch("Missing database table-name");
    });
  });
  it("throws a meaningful error when promise rejects", async () => {
    expect.assertions(3);
    dynamoMock
      .on(PutCommand, { Item: { pk: "rejects", sk: "rejects" } })
      .rejects();
    putItem({
      pk: "rejects",
      sk: "rejects",
      entityType: "intro",
      updatedAt: "",
    }).catch((err) => {
      expect(err.message).toMatch(/Database/i);
      expect(err.message).toMatch(/TableName/i);
      expect(err.message).toMatch(/dummy_table_name/i);
    });
  });

  //
});
