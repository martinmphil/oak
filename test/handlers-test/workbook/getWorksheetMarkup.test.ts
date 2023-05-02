import { getWorksheetMarkup } from "../../../lib/handlers/workbook/getWorksheetMarkup";

import * as getItemMod from "../../../lib/handlers/getItem";

const dummyHtml = "<div>dummy</div>";

describe("getWorksheet", () => {
  it("exists", () => {
    expect(getWorksheetMarkup).toBeDefined();
  });

  it("calls getItem and returns markup", async () => {
    expect.assertions(3);
    jest
      .spyOn(getItemMod, "getItem")
      .mockResolvedValueOnce({ markup: dummyHtml });
    const result = await getWorksheetMarkup("worksheet1");
    expect(getItemMod.getItem).toHaveBeenCalled();
    expect(getItemMod.getItem).toHaveBeenCalledWith("worksheet1", "worksheet1");
    expect(result).toBe(dummyHtml);
  });

  it("throws an error if markup is invalid", () => {
    expect.assertions(3);
    jest.spyOn(getItemMod, "getItem").mockResolvedValueOnce({ markup: "" });
    getWorksheetMarkup("worksheet1").catch((err) => {
      expect(err).toBeDefined();
      expect(err.message).toMatch("worksheet1");
      expect(err.message).toMatch(/failed to get the markup for worksheet/i);
    });
  });

  it("throws an error if getItem fails", () => {
    expect.assertions(4);
    jest.spyOn(getItemMod, "getItem").mockRejectedValueOnce(new Error("dummy"));
    getWorksheetMarkup("worksheet1").catch((err) => {
      expect(err).toBeDefined();
      expect(err.message).toMatch("worksheet1");
      expect(err.message).toMatch(/failed to get the markup for worksheet/i);
      expect(err.message).toMatch("dummy");
    });
  });

  //
});
