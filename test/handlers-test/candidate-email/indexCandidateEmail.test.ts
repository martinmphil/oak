import { handler } from "../../../lib/handlers/candidate-email";

const dummyEvent = {
  version: "1",
  routeKey: "dummy_key",
  rawPath: "dummy_path",
  rawQueryString: "",
  headers: { auth: "auth" },
  requestContext: "dummy_context",
  isBase64Encoded: "false",
};

describe("candidate-email handler fn", () => {
  it("returns a promise", async () => {
    expect.assertions(1);
    // @ts-ignore
    await expect(handler(dummyEvent)).resolves.not.toThrow();
  });
});
