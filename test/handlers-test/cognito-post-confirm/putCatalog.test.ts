import { putCatalog } from "../../../lib/handlers/cognito-post-confirm/putCatalog";

import * as putItemMod from "../../../lib/handlers/putItem";

describe("put catalog module", () => {
  const putItemSpy = jest.spyOn(putItemMod, "putItem");

  const candidataId = "can333";
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
    const result = await putCatalog(candidataId, standardCatalog);
    expect(result?.$metadata.httpStatusCode).toEqual(200);
  });

  it("throws a meaningful error if get item rejects", async () => {
    expect.assertions(6);
    console.warn = jest.fn();
    putItemSpy.mockRejectedValueOnce(new Error("dummy_error"));

    await putCatalog(candidataId, standardCatalog).catch((err) => {
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
