import { getStandardCatalog } from "../../../lib/handlers/cognito-post-confirm/getStandardCatalog";

import * as getItemMod from "../../../lib/handlers/getItem";

describe("get standard catalog", () => {
  const getItemSpy = jest.spyOn(getItemMod, "getItem");

  it("exists", () => {
    expect(getStandardCatalog).toBeDefined();
  });

  it("asychronously returns a standard catalog array of workflow IDs", () => {
    expect.assertions(2);
    getItemSpy.mockResolvedValueOnce({
      catalog: ["wflow1", "wflow2", "wflow3", "wflow4"],
    });
    getStandardCatalog().then((response) => {
      expect(Array.isArray(response)).toBe(true);
      expect(response[1]).toBe("wflow2");
    });
  });

  it("throws a meaningful error if get item rejects", async () => {
    expect.assertions(6);
    console.warn = jest.fn();
    getItemSpy.mockRejectedValueOnce(new Error("dummy_error"));

    await getStandardCatalog().catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/We failed to get the standard catalog/i);
      expect(err.message).toMatch(/dummy_error/i);
      expect(console.warn).toHaveBeenCalled();
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(/We failed to get the standard catalog/i)
      );
      expect(console.warn).toBeCalledWith(
        expect.stringMatching(/dummy_error/i)
      );
    });
  });

  it("throws an error if data is missing", () => {
    expect.assertions(2);
    getItemSpy.mockResolvedValueOnce({});

    getStandardCatalog().catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(
        "Our databank supplied a malformed array of strings"
      );
    });
  });

  it("throws an error if data is not an array", () => {
    expect.assertions(3);
    getItemSpy.mockResolvedValueOnce({ catalog: "dummy_string" });

    getStandardCatalog().catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(
        /Our databank supplied a malformed array of strings/i
      );
      expect(err.message).toMatch(/dummy_string/i);
    });
  });

  it("throws an error if data is an empty array", () => {
    expect.assertions(2);
    getItemSpy.mockResolvedValueOnce({ catalog: [] });

    getStandardCatalog().catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(
        /Our databank supplied a malformed array of strings/i
      );
    });
  });

  //
});
