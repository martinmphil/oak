import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { putCatalog } from "../../../lib/handlers/cognito-post-confirm/putCatalog";

// putCatalog(canId, catalog)

describe("put catalog module", () => {
  const originalEnv = process.env;
  const dynamoMock = mockClient(DynamoDBDocumentClient);
  beforeEach(() => {
    process.env.DATABASE_NAME_OAK = "dummy_table_name";
    jest.resetModules();
    dynamoMock.reset();
    dynamoMock
      .on(PutCommand, {
        Item: {
          pk: "can333",
          sk: "catalog",
          entityType: "catalogData",
          catalog: ["workflow101", "workflow201"],
        },
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
    jest.clearAllMocks();
    process.env = originalEnv;
    jest.resetModules();
    dynamoMock.reset();
  });

  const canId = "can333";
  const standardCatalog = ["workflow101", "workflow201"];

  it("returns a promise", async () => {
    expect.assertions(1);
    await expect(putCatalog(canId, standardCatalog)).resolves.not.toThrow();
  });

  it("returns status 200 with legitimate arguments", () => {
    expect.assertions(1);
    putCatalog(canId, standardCatalog).then((x) => {
      expect(x?.$metadata.httpStatusCode).toEqual(200);
    });
  });

  //
});
