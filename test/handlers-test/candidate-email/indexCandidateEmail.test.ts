import { handler } from "../../../lib/handlers/candidate-email";
import { dummyEvent } from "../dummyEvent";

describe("candidate-email handler fn", () => {
  it("returns a promise", async () => {
    expect.assertions(1);
    // @ts-ignore
    await expect(handler(dummyEvent)).resolves.not.toThrow();
  });
});
