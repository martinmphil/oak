import { mockClient } from "aws-sdk-client-mock";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { handler } from "../../../lib/handlers/cognito-post-confirm/index";
import * as getStandardCatalogMod from "../../../lib/handlers/cognito-post-confirm/getStandardCatalog";
import * as putCatalogMod from "../../../lib/handlers/cognito-post-confirm/putCatalog";

const dummyCognitoEvent = {
  request: {
    userAttributes: {
      email: "user@example.com",
      email_verified: "true",
      sub: "dummy_username",
    },
  },
  version: "1",
  region: "eu-west-1",
  userPoolId: "dummy",
  triggerSource: "PostConfirmation_ConfirmSignUp",
  userName: "dummy",
  callerContext: "dummy",
  response: {},
};

describe("cognito-post-confirm lambda function", () => {
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
      .resolves({ Item: { catalog: ["workflow101", "workflow201"] } });
    dynamoMock
      .on(PutCommand, {
        Item: {
          pk: "candidate-dummy_username",
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

  it("returns the event", () => {
    expect.assertions(1);
    // @ts-ignore
    handler(dummyCognitoEvent).then((x) => {
      expect(x).toEqual(dummyCognitoEvent);
    });
  });

  it("warns the console if standard catalog array is empty", () => {
    expect.assertions(2);
    console.warn = jest.fn();
    dynamoMock
      .on(GetCommand, {
        Key: { pk: "standardCatalog", sk: "standardCatalog" },
      })
      .resolves({ Item: { catalog: [] } });
    // @ts-ignore
    handler(dummyCognitoEvent).then((x) => {
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(/standard.*catalog.*empty/i)
      );
      expect(x).toEqual(dummyCognitoEvent);
    });
  });

  it("warns when handler try-catch errors", () => {
    expect.assertions(1);
    console.warn = jest.fn();
    jest
      .spyOn(getStandardCatalogMod, "getStandardCatalog")
      .mockRejectedValueOnce("dummy_error_message");
    // @ts-ignore
    handler(dummyCognitoEvent).then(() => {
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(
          /cognito-post-confirm failed.*dummy_error_message/i
        )
      );
    });
  });

  it("files standard catalog in database under username", () => {
    expect.assertions(4);

    const spy001 = jest.spyOn(putCatalogMod, "putCatalog");
    // @ts-ignore
    handler(dummyCognitoEvent).then((x) => {
      expect(spy001).toBeCalled();
      expect(spy001).toBeCalledTimes(1);
      expect(spy001).toBeCalledWith("candidate-dummy_username", [
        "workflow101",
        "workflow201",
      ]);
      expect(x).toEqual(dummyCognitoEvent);
    });
  });

  //
});
