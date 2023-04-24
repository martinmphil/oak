import { putCatalog } from "../../../lib/handlers/cognito-post-confirm/putCatalog";

import * as dynamoUtilsMod from "../../../lib/handlers/dynamoUtils";

describe("put catalog module", () => {
  const putItemSpy = jest.spyOn(dynamoUtilsMod, "putItem");

  const canId = "can333";
  const standardCatalog = ["workflow101", "workflow201"];

  it("exists", () => {
    expect(putCatalog).toBeDefined();
  });

  it("returns a 200 code with legitimate arguments", async () => {
    expect.assertions(1);
    putItemSpy.mockResolvedValueOnce({
      $metadata: {
        httpStatusCode: 200,
        requestId: "DUMMY1",
        attempts: 1,
        totalRetryDelay: 0,
      },
    });
    const result = await putCatalog(canId, standardCatalog);
    expect(result?.$metadata.httpStatusCode).toEqual(200);
  });

  it("throws a meaningful error if get item rejects", async () => {
    expect.assertions(6);
    console.warn = jest.fn();
    putItemSpy.mockRejectedValueOnce(new Error("dummy_error"));

    await putCatalog(canId, standardCatalog).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/failed to put the standard catalog/i);
      expect(err.message).toMatch(/dummy_error/i);
      expect(console.warn).toHaveBeenCalled();
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(/failed to put the standard catalog/i)
      );
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(/dummy_error/i)
      );
    });
  });

  //
});
