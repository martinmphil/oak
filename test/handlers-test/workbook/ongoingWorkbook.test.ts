import { ongoingWorkbook } from "../../../lib/handlers/workbook/ongoingWorkbook";
import * as getWorksheetMarkupMod from "../../../lib/handlers/workbook/getWorksheetMarkup";
import * as processWorkbookEventMod from "../../../lib/handlers/workbook/processWorkbookEvent";

describe("ongoingWorkbook", () => {
  const getWorksheetMarkupSpy = jest.spyOn(
    getWorksheetMarkupMod,
    "getWorksheetMarkup"
  );
  getWorksheetMarkupSpy.mockResolvedValue("dummy_getWorksheetMarkup_html");

  const processWorkbookEventSpy = jest.spyOn(
    processWorkbookEventMod,
    "processWorkbookEvent"
  );
  processWorkbookEventSpy.mockResolvedValue(
    "dummy_processWorkbookEvent_markup"
  );

  const candidateId = "candidate-dummy_username";
  const workflowId = "workflow101";
  const dummyAssessmentData = {
    pk: candidateId,
    sk: workflowId,
    entityType: "assessmentData",
    workflow: ["worksheet1", "worksheet2", "worksheet3"],
    createdAt: "dummyTimestamp",
    updatedAt: "dummyTimestamp",
    submissionsArr: [{ worksheetId: "worksheet1", candidateAnswer: "a3" }],
  };

  const dummyWorkbookEventJson =
    '{"workbookEvent":{"worksheetId":"worksheet2","candidateAnswer":"a1"}}';

  it("exists", () => {
    expect(ongoingWorkbook).toBeDefined();
  });

  it("returns a promise", () => {
    expect.assertions(1);
    expect(
      ongoingWorkbook(dummyAssessmentData, undefined)
    ).resolves.not.toThrow();
  });

  it("resolves to a string", async () => {
    expect.assertions(2);
    const result = await ongoingWorkbook(dummyAssessmentData, undefined);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(1);
  });

  it("throws a fault if missing assessmentData", () => {
    expect.assertions(3);
    ongoingWorkbook(undefined, undefined).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/ongoingWorkbook.*failed/i);
      expect(err.message).toMatch(/missing assessmentData/i);
    });
  });

  it("throws a fault if missing candidateId", () => {
    let badAssessmentData = JSON.parse(JSON.stringify(dummyAssessmentData));
    badAssessmentData.pk = "";
    expect.assertions(3);
    ongoingWorkbook(badAssessmentData, undefined).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/ongoingWorkbook.*failed/i);
      expect(err.message).toMatch(/missing candidateId/i);
    });
  });

  it("throws a fault if missing workflowId", () => {
    let badAssessmentData = JSON.parse(JSON.stringify(dummyAssessmentData));
    badAssessmentData.sk = "";
    expect.assertions(3);
    ongoingWorkbook(badAssessmentData, undefined).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/ongoingWorkbook.*failed/i);
      expect(err.message).toMatch(/missing workflowId/i);
    });
  });

  it("throws a fault if workflow array is malformed", () => {
    let badAssessmentData = JSON.parse(JSON.stringify(dummyAssessmentData));
    badAssessmentData.workflow = [""];
    expect.assertions(3);
    ongoingWorkbook(badAssessmentData, undefined).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/ongoingWorkbook.*failed/i);
      expect(err.message).toMatch(/malformed array/i);
    });
  });

  it("gets markup for 1st unanswered worksheet if missing candidateAnswer", () => {
    expect.assertions(3);
    ongoingWorkbook(dummyAssessmentData, undefined).then((response) => {
      expect(response).toMatch(/dummy_getWorksheetMarkup_html/i);
      expect(getWorksheetMarkupSpy).toBeCalled();
      expect(getWorksheetMarkupSpy).toBeCalledWith(workflowId, "worksheet2");
    });
  });

  it("calls processWorkbookEvent when 2nd arg is valid json", () => {
    expect.assertions(3);
    ongoingWorkbook(dummyAssessmentData, dummyWorkbookEventJson).then(
      (response) => {
        expect(response).toMatch(/dummy_processWorkbookEvent_markup/i);
        expect(processWorkbookEventSpy).toBeCalled();
        expect(processWorkbookEventSpy).toBeCalledWith(
          candidateId,
          workflowId,
          JSON.parse(
            '{"workbookEvent":{"worksheetId":"worksheet2","candidateAnswer":"a1"}}'
          ),
          ["worksheet2", "worksheet3"]
        );
      }
    );
  });

  //
});
