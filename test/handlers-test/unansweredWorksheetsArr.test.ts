import { unansweredWorksheetArr } from "../../lib/handlers/unansweredWorksheetArr";

describe("unaswered function", () => {
  it("exists", () => {
    expect(unansweredWorksheetArr).toBeDefined();
    expect(typeof unansweredWorksheetArr).toBe("function");
  });

  it("returns array of unanswered worksheetIDs", () => {
    const workflow1 = ["wsheet1", "wsheet2", "wsheet3"];
    const submissionsArr1 = [{ worksheetId: "wsheet1", candidateAnswer: "a1" }];
    const expected1 = ["wsheet2", "wsheet3"];
    const result1 = unansweredWorksheetArr(workflow1, submissionsArr1);
    expect(result1).toStrictEqual(expected1);

    const workflow2 = ["wsheet1", "wsheet2", "wsheet3"];
    const submissionsArr2 = [
      { worksheetId: "wsheet1", candidateAnswer: "a1" },
      { worksheetId: "wsheet2", candidateAnswer: "a1" },
    ];
    const expected2 = ["wsheet3"];
    const result2 = unansweredWorksheetArr(workflow2, submissionsArr2);
    expect(result2).toStrictEqual(expected2);

    const workflow3 = ["wsheet1", "wsheet2", "wsheet3"];
    const submissionsArr3 = [
      { worksheetId: "wsheet1", candidateAnswer: "a1" },
      { worksheetId: "wsheet2", candidateAnswer: "a1" },
      { worksheetId: "wsheet3", candidateAnswer: "a1" },
    ];
    const result3 = unansweredWorksheetArr(workflow3, submissionsArr3);
    expect(result3).toStrictEqual([]);
    expect(result3.length).toBe(0);
  });

  it("returns full array of unanswered worksheetIDs when submission is empty", () => {
    const workflow1 = ["wsheet1", "wsheet2", "wsheet3"];
    const submissionsArr1: string[] = [];
    // @ts-ignore
    const result = unansweredWorksheetArr(workflow1, submissionsArr1);
    expect(result).toStrictEqual(workflow1);
  });

  it("returns full array of unanswered worksheetIDs when submission is undefined", () => {
    const workflow1 = ["wsheet1", "wsheet2", "wsheet3"];
    const submissionsArr1 = undefined;
    // @ts-ignore
    const result = unansweredWorksheetArr(workflow1, submissionsArr1);
    expect(result).toStrictEqual(workflow1);
    expect(result.length).toBe(3);
  });

  it("copes with duplicates", () => {
    const workflow1 = [
      "wsheet1",
      "wsheet2",
      "wsheet3",
      "wsheet1",
      "wsheet2",
      "wsheet3",
    ];
    const submissionsArr1 = [{ worksheetId: "wsheet1", candidateAnswer: "a1" }];
    const expected1 = ["wsheet2", "wsheet3"];
    const result1 = unansweredWorksheetArr(workflow1, submissionsArr1);
    expect(result1).toStrictEqual(expected1);
    const workflow2 = ["wsheet1", "wsheet2", "wsheet3"];
    const submissionsArr2 = [
      { worksheetId: "wsheet1", candidateAnswer: "a1" },
      { worksheetId: "wsheet2", candidateAnswer: "a1" },
      { worksheetId: "wsheet1", candidateAnswer: "a1" },
      { worksheetId: "wsheet2", candidateAnswer: "a1" },
    ];
    const expected2 = ["wsheet3"];
    const result2 = unansweredWorksheetArr(workflow2, submissionsArr2);
    expect(result2).toStrictEqual(expected2);

    const workflow3 = [
      "wsheet1",
      "wsheet2",
      "wsheet3",
      "wsheet1",
      "wsheet2",
      "wsheet3",
    ];
    const submissionsArr3 = [
      { worksheetId: "wsheet1", candidateAnswer: "a1" },
      { worksheetId: "wsheet2", candidateAnswer: "a1" },
      { worksheetId: "wsheet3", candidateAnswer: "a1" },
    ];
    const result3 = unansweredWorksheetArr(workflow3, submissionsArr3);
    expect(result3).toStrictEqual([]);
    expect(result3.length).toBe(0);
  });

  it("returns undefined if both arguments are undefined", () => {
    // @ts-ignore
    const result = unansweredWorksheetArr(undefined, undefined);
    expect(result).toBeUndefined();
  });

  it("returns undefined if workflow is undefined", () => {
    const submissionsArr = [{ worksheetId: "wsheet1", candidateAnswer: "a1" }];
    // @ts-ignore
    const result = unansweredWorksheetArr(undefined, submissionsArr);
    expect(result).toBeUndefined();
  });

  it("copes with malformed submissions array", () => {
    const workflow = ["wsheet1", "wsheet2", "wsheet3"];
    const submissionsArr = [
      { worksheetId: "wsheet1", candidateAnswer: "a1" },
      { candidateAnswer: "a1" },
      { worksheetId: "wsheet3", candidateAnswer: "a1" },
    ];
    // @ts-ignore
    const result = unansweredWorksheetArr(workflow, submissionsArr);
    expect(result).toStrictEqual(["wsheet2"]);
  });

  //
});
