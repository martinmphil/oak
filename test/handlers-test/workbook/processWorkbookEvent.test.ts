import { processWorkbookEvent } from "../../../lib/handlers/workbook/processWorkbookEvent";
import * as updateSubmissionMod from "../../../lib/handlers/workbook/updateSubmissions";
import * as achievedWorkbookMod from "../../../lib/handlers/workbook/achievedWorkbook";
import * as getWorksheetMarkupMod from "../../../lib/handlers/workbook/getWorksheetMarkup";

const candidateId = "candidate-dummy_username";
const workflowId = "workflow101";
const worksheetId = "worksheet1";
const candidateAnswer = "a1";
const workbookEventData = {
  workbookEvent: { worksheetId: "worksheet1", candidateAnswer },
};
const unansweredArr = ["worksheet1", "worksheet2", "worksheet3"];

describe("processWorkbookEvent", () => {
  const updateSubmissionSpy = jest.spyOn(
    updateSubmissionMod,
    "updateSubmissions"
  );
  const achievedWorkbookSpy = jest.spyOn(
    achievedWorkbookMod,
    "achievedWorkbook"
  );
  const getWorksheetMarkupSpy = jest.spyOn(
    getWorksheetMarkupMod,
    "getWorksheetMarkup"
  );

  beforeEach(() => {
    // @ts-ignore
    updateSubmissionSpy.mockResolvedValue({});
    getWorksheetMarkupSpy.mockResolvedValue("dummy_worksheet_html");
    achievedWorkbookSpy.mockResolvedValue("dummy_achieved_html");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls updateSubmission with correct arguments", async () => {
    expect.assertions(2);
    await processWorkbookEvent(
      candidateId,
      workflowId,
      workbookEventData,
      unansweredArr
    );
    expect(updateSubmissionSpy).toHaveBeenCalled();
    expect(updateSubmissionSpy).toHaveBeenCalledWith(
      candidateId,
      workflowId,
      worksheetId,
      candidateAnswer
    );
  });

  it("calls achievedWorkbook", async () => {
    expect.assertions(2);
    await processWorkbookEvent(candidateId, workflowId, workbookEventData, [
      "worksheet1",
    ]);
    expect(achievedWorkbookSpy).toHaveBeenCalled();
    expect(achievedWorkbookSpy).toBeCalledWith(candidateId, workflowId);
  });

  it("calls getWorksheetMarkup with next unanswered worksheetId", async () => {
    await processWorkbookEvent(
      candidateId,
      workflowId,
      workbookEventData,
      unansweredArr
    );
    expect(getWorksheetMarkupSpy).toHaveBeenCalledWith(
      workflowId,
      "worksheet2"
    );
  });

  it("returns a string", async () => {
    const result = await processWorkbookEvent(
      candidateId,
      workflowId,
      workbookEventData,
      unansweredArr
    );
    expect(typeof result === "string").toBe(true);
  });

  it("returns empty string if worksheetId is missing", async () => {
    const result = await processWorkbookEvent(
      candidateId,
      workflowId,
      { workbookEvent: { candidateAnswer: "a1" } },
      unansweredArr
    );
    expect(result).toBe("");
  });

  it("returns empty string if candidateAnswer is missing", async () => {
    const result = await processWorkbookEvent(
      candidateId,
      workflowId,
      { workbookEvent: { worksheetId: "worksheet1" } },
      unansweredArr
    );
    expect(result).toBe("");
  });

  it("returns empty string if candidateAnswer is empty", async () => {
    const result = await processWorkbookEvent(
      candidateId,
      workflowId,
      { workbookEvent: { worksheetId: "worksheet1", candidateAnswer: "" } },
      unansweredArr
    );
    expect(result).toBe("");
  });

  //
});
