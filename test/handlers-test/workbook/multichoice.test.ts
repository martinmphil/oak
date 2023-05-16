import { multichoice } from "../../../lib/handlers/workbook/multichoice";
import { IMultichoiceObj } from "../../../lib/handlers/dynamoInterface";

describe("multichoice function", () => {
  const dummyWorkflowId = "workflow101";
  const dummyWorksheetId = "worksheet1";
  const dummyMultichoiceObj: IMultichoiceObj = {
    scenario: "<p>dummy_scenario</p>",
    choicesArr: ["dummyChoice1", "dummyChoice2", "dummyChoice3"],
    rubricArr: [
      {
        answer: "dummyAnswer",
        mark: 1,
      },
    ],
  };

  it("exists", () => {
    expect(multichoice).toBeDefined();
    expect(typeof multichoice).toBe("function");
  });

  it("returns scenario", () => {
    const result = multichoice(
      dummyWorkflowId,
      dummyWorksheetId,
      dummyMultichoiceObj
    );
    expect(result).toMatch(/scenario/i);
  });

  it("returns buttons div", () => {
    const result = multichoice(
      dummyWorkflowId,
      dummyWorksheetId,
      dummyMultichoiceObj
    );
    expect(result).toMatch(/<div class=choices>.*<\/div>/i);
  });

  it("returns buttons html", () => {
    const result = multichoice(
      dummyWorkflowId,
      dummyWorksheetId,
      dummyMultichoiceObj
    );
    expect(result).toMatch(/<button type="button"/i);
    expect(result).toMatch(
      /data-candidate-answer="a1" data-workflow-id="workflow101" data-worksheet-id="worksheet1">dummyChoice1<\/button>/i
    );
    expect(result).toMatch(
      /data-candidate-answer="a2" data-workflow-id="workflow101" data-worksheet-id="worksheet1">dummyChoice2<\/button>/i
    );
    expect(result).toMatch(
      /data-candidate-answer="a3" data-workflow-id="workflow101" data-worksheet-id="worksheet1">dummyChoice3<\/button>/i
    );
  });

  it("throws an error if obj is missing", () => {
    // @ts-ignore
    expect(() => multichoice(undefined)).toThrow();
  });

  it("throws an error if obj is null", () => {
    // @ts-ignore
    expect(() => multichoice(null)).toThrow();
  });

  it("throws an error if scenario is missing", () => {
    let badObj = JSON.parse(JSON.stringify(dummyMultichoiceObj));
    badObj.scenario = "";
    expect(() =>
      multichoice(dummyWorkflowId, dummyWorkflowId, badObj)
    ).toThrow();
  });

  it("throws an error if choices array is empty", () => {
    let badObj = JSON.parse(JSON.stringify(dummyMultichoiceObj));
    badObj.choicesArr = [];
    expect(() =>
      multichoice(dummyWorkflowId, dummyWorksheetId, badObj)
    ).toThrow();
  });

  it("throws an error if choices array contains empty strings", () => {
    let badObj = JSON.parse(JSON.stringify(dummyMultichoiceObj));
    badObj.choicesArr = ["", "", ""];
    expect(() =>
      multichoice(dummyWorkflowId, dummyWorksheetId, badObj)
    ).toThrow();
  });

  //
});
