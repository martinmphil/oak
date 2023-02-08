import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { getItem, putItem } from "../../lib/handlers/database_utils";

describe("lambda utils", () => {
  const originalEnv = process.env;
  const dynamoMock = mockClient(DynamoDBDocumentClient);
  beforeEach(() => {
    jest.resetModules();
    dynamoMock.reset();
  });
  afterEach(() => {
    process.env = originalEnv;
  });

  it("exports get-item function", async () => {
    dynamoMock
      .on(GetCommand)
      .resolves({
        Item: undefined,
      })
      .on(GetCommand, {
        TableName: "dummy_table_name",
        Key: { pk: "standardCatalog", sk: "standardCatalog" },
      })
      .resolves({ Item: { catalog: ["exam1", "exam2"] } });

    const Item = await getItem("standardCatalog", "standardCatalog");
    expect(Item.catalog[0]).toStrictEqual("exam1");
  });

  it("exports put-item function", async () => {
    dynamoMock
      .on(PutCommand)
      .resolves({})
      .on(PutCommand, {
        TableName: "dummy_table_name",
        Item: { pk: "dummyPk", sk: "dummySk", newAttribute: "dummyValue" },
      })
      .resolves({
        $metadata: {
          httpStatusCode: 200,
          requestId: "DUMMY1",
          attempts: 1,
          totalRetryDelay: 0,
        },
      });

    const response = await putItem({
      pk: "dummyPk",
      sk: "dummySk",
      newAttribute: "dummyValue",
    });
    expect(response["$metadata"]).toHaveProperty("httpStatusCode", 200);
  });

  //
});
