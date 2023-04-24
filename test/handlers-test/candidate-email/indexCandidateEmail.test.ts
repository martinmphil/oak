import { handler } from "../../../lib/handlers/candidate-email";

describe("candidate-email handler fn", () => {
  it("exists", () => {
    expect(handler).toBeDefined();
  });

  it("handles bad event", async () => {
    // expect.assertions(1);
    console.warn = jest.fn();
    // @ts-ignore
    await handler("badDummyEvent").then((response) => {
      expect(response?.error).toMatch(
        /candidate-email lambda function failed/i
      );
    });
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/candidate-email lambda function failed/i)
    );
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/cognito get-user-command failed/i)
    );
  });
});
