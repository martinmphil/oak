import { handler } from "../../../lib/handlers/candidate-email";
import { dummyCandidateEmailEvent } from "./dummyCandidateEmailEvent";

describe("candidate-email handler fn", () => {
  it("exists", () => {
    expect(handler).toBeDefined();
  });

  it("warns if authorization header is missing", async () => {
    expect.assertions(4);
    console.warn = jest.fn();
    const badDummEvent = JSON.parse(JSON.stringify(dummyCandidateEmailEvent));
    badDummEvent.headers.authorization = undefined;
    // @ts-ignore
    await handler(badDummEvent).then((response) => {
      expect(response?.error).toMatch(
        /candidate-email lambda function failed/i
      );
    });
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/candidate-email lambda function failed/i)
    );
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/missing authorization header/i)
    );
  });

  it("handles bad event", async () => {
    expect.assertions(4);
    console.warn = jest.fn();
    // @ts-ignore
    await handler(dummyCandidateEmailEvent).then((response) => {
      expect(response?.error).toMatch(
        /candidate-email lambda function failed/i
      );
    });
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/candidate-email lambda function failed/i)
    );
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/cognito GetUserCommand failed/i)
    );
  });

  //
});
