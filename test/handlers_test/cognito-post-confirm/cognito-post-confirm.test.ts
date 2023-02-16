import { handler } from "../../../lib/handlers/cognito-post-confirm/index";

const dummyCognitoEvent = {
  request: {
    userAttributes: {
      email: "user@example.com",
      email_verified: true,
      sub: "dummy_username",
    },
  },
  response: {},
};

describe("cognito-post-confirm lambda function", () => {
  it("returns the event", async () => {
    // @ts-ignore
    const x = await handler(dummyCognitoEvent);
    expect(x).toEqual(dummyCognitoEvent);
  });
});
