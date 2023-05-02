// jest tests
// take argument worksheetId
// return Item rubric object
// throws error if rubric not found
// throws error if getItem fails
// calls getItem

//

// import { getWorksheetRubric } from "../../../lib/handlers/workbook/getWorksheetRubric";

import * as getItemsMod from "../../../lib/handlers/getItem";

describe("getWorksheet", () => {
  //
  // dummy
  it("dummy", () => {
    expect(true).toBe(true);
  });

  //

  // it("exists", () => {
  //   expect(getWorksheetRubric).toBeDefined();
  // });

  // it("calls getItem", async () => {
  //   jest
  //     .spyOn(getItemsMod, "getItem")
  //     .mockResolvedValueOnce({ rubric: {a4:1} });
  //   await getWorksheetRubric("worksheet1");
  //   expect(getItemsMod.getItem).toHaveBeenCalled();
  // });
});
