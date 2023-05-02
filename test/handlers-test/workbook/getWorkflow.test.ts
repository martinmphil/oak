import { getWorkflow } from "../../../lib/handlers/workbook/getWorkflow";
import * as getItemMod from "../../../lib/handlers/getItem";

describe("getWorkflow", () => {
  beforeEach(() => {
    console.warn = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("exists", () => {
    expect(getWorkflow).toBeDefined();
  });

  it("returns a valid workflow", () => {
    expect.assertions(3);
    const getItemSpy = jest.spyOn(getItemMod, "getItem");
    getItemSpy.mockResolvedValueOnce({ workflow: ["wsheet1", "wsheet2"] });
    getWorkflow("wflow1").then((response) => {
      expect(response).toEqual(["wsheet1", "wsheet2"]);
    });
    expect(getItemSpy).toBeCalled();
    expect(getItemSpy).toBeCalledWith("wflow1", "wflow1");
  });

  it("warns and throws an error if get item returns empty workflow array", () => {
    expect.assertions(5);
    const getItemSpy = jest.spyOn(getItemMod, "getItem");
    getItemSpy.mockResolvedValueOnce({ workflow: [] });
    getWorkflow("wflow1").catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/malformed array of strings/i);
      expect(err.message).toMatch(/get-workflow failed/i);
    });
    expect(getItemSpy).toBeCalled();
    expect(getItemSpy).toBeCalledWith("wflow1", "wflow1");
  });

  it("warns and throws an error if get item returns invalid workflow array", () => {
    expect.assertions(5);
    const getItemSpy = jest.spyOn(getItemMod, "getItem");
    getItemSpy.mockResolvedValueOnce({ workflow: 1 });
    getWorkflow("wflow1").catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/malformed array of strings/i);
      expect(err.message).toMatch(/get-workflow failed/i);
    });
    expect(getItemSpy).toBeCalled();
    expect(getItemSpy).toBeCalledWith("wflow1", "wflow1");
  });

  it("warns and throws an error if get item rejects", () => {
    expect.assertions(5);
    const getItemSpy = jest.spyOn(getItemMod, "getItem");
    getItemSpy.mockRejectedValueOnce(
      new Error("Database failed to get data. ")
    );
    getWorkflow("wflow1").catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/database failed to get data/i);
      expect(err.message).toMatch(/get-workflow failed/i);
    });
    expect(getItemSpy).toBeCalled();
    expect(getItemSpy).toBeCalledWith("wflow1", "wflow1");
  });

  //
});
