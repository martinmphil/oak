import { getWorksheetMarkup } from "../../../lib/handlers/workbook/getWorksheetMarkup";

import * as getItemMod from "../../../lib/handlers/getItem";
import * as multichoice from "../../../lib/handlers/workbook/multichoice";
import { IMultichoiceObj } from "../../../lib/handlers/dynamoInterface";

describe("getWorksheet", () => {
  const dummyWorkflowId = "workflow101";
  const dummyHtml = "<div>dummy</div>";
  const dummyMultichoiceObj: IMultichoiceObj = {
    scenario: "string",
    choicesArr: ["dummyChoice1", "dummyChoice2", "dummyChoice3"],
    rubricArr: [
      {
        answer: "dummyAnswer",
        mark: 1,
      },
    ],
  };

  beforeEach(() => {
    const getItemSpy = jest.spyOn(getItemMod, "getItem");
    getItemSpy.mockResolvedValue({
      entityType: "multichoice",
      worksheetObj: dummyMultichoiceObj,
    });
    const multichoiceSpy = jest.spyOn(multichoice, "multichoice");
    multichoiceSpy.mockReturnValue(dummyHtml);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exists", () => {
    expect(getWorksheetMarkup).toBeDefined();
  });

  it("calls getItem", async () => {
    expect.assertions(3);
    jest
      .spyOn(getItemMod, "getItem")
      .mockResolvedValueOnce({ entityType: "multichoice" });
    const result = await getWorksheetMarkup(dummyWorkflowId, "worksheet1");
    expect(getItemMod.getItem).toHaveBeenCalled();
    expect(getItemMod.getItem).toHaveBeenCalledWith("worksheet1", "worksheet1");
    expect(result).toBeDefined();
  });

  it("throws an error if entityType is invalid", () => {
    expect.assertions(3);
    jest.spyOn(getItemMod, "getItem").mockResolvedValueOnce({ entityType: "" });
    getWorksheetMarkup(dummyWorkflowId, "worksheet1").catch((err) => {
      expect(err).toBeDefined();
      expect(err.message).toMatch("worksheet1");
      expect(err.message).toMatch(/getWorksheetMarkup/i);
    });
  });

  it("throws an error if getItem fails", () => {
    expect.assertions(4);
    jest.spyOn(getItemMod, "getItem").mockRejectedValueOnce(new Error("dummy"));
    getWorksheetMarkup(dummyWorkflowId, "worksheet1").catch((err) => {
      expect(err).toBeDefined();
      expect(err.message).toMatch("worksheet1");
      expect(err.message).toMatch(/getWorksheetMarkup/i);
      expect(err.message).toMatch("dummy");
    });
  });

  it("calls multichoice() module when entityType is multichoice", async () => {
    const result = await getWorksheetMarkup(dummyWorkflowId, "worksheet1");
    expect(multichoice.multichoice).toHaveBeenCalled();
    expect(result).toEqual(dummyHtml);
  });

  //
});
