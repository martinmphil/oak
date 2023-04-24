import { mockClient } from "aws-sdk-client-mock";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { handler } from "../../../lib/handlers/cognito-post-confirm/index";
import * as getStandardCatalogMod from "../../../lib/handlers/cognito-post-confirm/getStandardCatalog";
import * as putCatalogMod from "../../../lib/handlers/cognito-post-confirm/putCatalog";
import { dummyEvent } from "../listings/dummyEvent";

const dummyCognitoEvent = {
  version: "1",
  region: "eu-west-1",
  userPoolId: "eu-west-1_dummy_user_pool_id",
  userName: "dummy-user-name-abc-123",
  callerContext: {
    awsSdkVersion: "aws-sdk-unknown-unknown",
    clientId: "dummy_client_id_123",
  },
  triggerSource: "PostConfirmation_ConfirmSignUp",
  request: {
    userAttributes: {
      email: "user@example.com",
      email_verified: "true",
      sub: "dummy_username",
    },
  },
  response: {},
};

const originalWarn = console.warn;

describe("cognito-post-confirm lambda function", () => {
  const originalEnv = process.env;
  const dynamoMock = mockClient(DynamoDBDocumentClient);
  beforeEach(() => {
    process.env.DATABASE_NAME_OAK = "dummy_table_name";
    jest.restoreAllMocks();
    jest.resetModules();

    console.warn = jest.fn();

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
    () => (console.warn = originalWarn);
    console.warn = originalWarn;
    jest.restoreAllMocks();
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

  it('returns event but throws an error if the "sub" property is missing', () => {
    expect.assertions(3);
    const badCognitoEvent = JSON.parse(JSON.stringify(dummyCognitoEvent));
    badCognitoEvent.request.userAttributes.sub = "";
    // @ts-ignore
    handler(badCognitoEvent).then((x) => {
      expect(x).toEqual(badCognitoEvent);
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(/Cognito-post-confirm lambda failed/i)
      );
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(/Missing username/i)
      );
    });
  });

  it('returns event but throws an error if the "sub" property is a number', () => {
    expect.assertions(3);
    const badCognitoEvent = JSON.parse(JSON.stringify(dummyCognitoEvent));
    // @ts-ignore
    badCognitoEvent.request.userAttributes.sub = 1;
    // @ts-ignore
    handler(badCognitoEvent).then((x) => {
      expect(x).toEqual(badCognitoEvent);
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(/Cognito-post-confirm lambda failed/i)
      );
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(/Missing username/i)
      );
    });
  });

  it("warns the console if standard catalog array is an empty array", () => {
    expect.assertions(2);
    dynamoMock
      .on(GetCommand, {
        Key: { pk: "standardCatalog", sk: "standardCatalog" },
      })
      .resolves({ Item: { catalog: [] } });
    // @ts-ignore
    handler(dummyCognitoEvent).then((x) => {
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(/catalog.*empty/i)
      );
      expect(x).toEqual(dummyCognitoEvent);
    });
  });

  it("warns when handler try-catch errors", () => {
    expect.assertions(1);
    jest
      .spyOn(getStandardCatalogMod, "getStandardCatalog")
      .mockRejectedValueOnce("dummy_error_message");
    // @ts-ignore
    handler(dummyCognitoEvent).then(() => {
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(
          /cognito-post-confirm.*failed.*dummy_error_message/i
        )
      );
    });
  });

  it("files standard catalog in database under username", () => {
    expect.assertions(4);
    const putCatalogSpy = jest.spyOn(putCatalogMod, "putCatalog");
    // @ts-ignore
    handler(dummyCognitoEvent).then((x) => {
      expect(putCatalogSpy).toBeCalled();
      expect(putCatalogSpy).toBeCalledTimes(1);
      expect(putCatalogSpy).toBeCalledWith("candidate-dummy_username", [
        "workflow101",
        "workflow201",
      ]);
      expect(x).toEqual(dummyCognitoEvent);
    });
  });

  it("returns event but throws an errror if put catalog fails", () => {
    expect.assertions(6);
    const putCatalogSpy = jest.spyOn(putCatalogMod, "putCatalog");
    putCatalogSpy.mockRejectedValueOnce("dummy_error_message");
    // @ts-ignore
    handler(dummyCognitoEvent).then((x) => {
      expect(putCatalogSpy).toBeCalled();
      expect(putCatalogSpy).toBeCalledTimes(1);
      expect(x).toEqual(dummyCognitoEvent);

      expect(x).toEqual(dummyCognitoEvent);
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(/failed to put standard catalog/i)
      );
      expect(console.warn).toBeCalledWith(expect.stringMatching(/databank/i));
    });
  });

  //
});
