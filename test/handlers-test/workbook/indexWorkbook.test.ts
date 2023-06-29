import { handler } from "../../../lib/handlers/workbook/index";

import { dummyDebutEvent } from "./dummyDebutEvent";
import { dummyOngoingEvent } from "./dummyOngoingEvent";
import * as getAssessmentDataMod from "../../../lib/handlers/workbook/getAssessmentData";
import * as debutWorkbookMod from "../../../lib/handlers/workbook/debutWorkbook";
import * as unansweredWorksheetArrMod from "../../../lib/handlers/unansweredWorksheetArr";
import * as achievedWorkbookMod from "../../../lib/handlers/workbook/achievedWorkbook";
import * as ongoingWorkbookMod from "../../../lib/handlers/workbook/ongoingWorkbook";

describe("index workbook lambda function", () => {
  const candidateId = "candidate-dummy_username";
  const workflowId = "workflow101";
  const getAssessmentDataSpy = jest.spyOn(
    getAssessmentDataMod,
    "getAssessmentData"
  );
  const debutWorkbookSpy = jest.spyOn(debutWorkbookMod, "debutWorkbook");
  const unansweredWorksheetArrSpy = jest.spyOn(
    unansweredWorksheetArrMod,
    "unansweredWorksheetArr"
  );
  const achievedWorkbookSpy = jest.spyOn(
    achievedWorkbookMod,
    "achievedWorkbook"
  );
  const ongoingWorkbookSpy = jest.spyOn(ongoingWorkbookMod, "ongoingWorkbook");

  const achievedAssessmentData = {
    pk: candidateId,
    sk: workflowId,
    entityType: "assessmentData",
    workflow: ["worksheet1", "worksheet2", "worksheet3"],
    submissionsArr: [
      { worksheetId: "worksheet1", candidateAnswer: "a1" },
      { worksheetId: "worksheet2", candidateAnswer: "a1" },
      { worksheetId: "worksheet3", candidateAnswer: "a1" },
    ],
  };

  const ongoingAssessmentData = {
    pk: candidateId,
    sk: workflowId,
    entityType: "assessmentData",
    workflow: ["worksheet1", "worksheet2", "worksheet3"],
    submissionsArr: [{ worksheetId: "worksheet1", candidateAnswer: "a3" }],
  };

  beforeEach(() => {
    console.warn = jest.fn();
  });

  it("it resolves to default html and warns if event username is empty", async () => {
    expect.assertions(5);
    const badDebutEvent = JSON.parse(JSON.stringify(dummyDebutEvent));
    badDebutEvent.requestContext.authorizer.jwt.claims.username = "";
    // @ts-ignore
    await handler(badDebutEvent).then((response) => {
      expect(response?.body).toMatch(/refresh this page.*try again later/i);
      expect(response?.body).toMatch(
        /tell your administrator an error occurred.*:.*:/i
      );
    });
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/index workbook.*failed/i)
    );
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/missing username/i)
    );
  });

  it("it resolves to default html and warns if event workflowId is empty", async () => {
    expect.assertions(5);
    const badDebutEvent = JSON.parse(JSON.stringify(dummyDebutEvent));
    badDebutEvent.pathParameters.workflowId = "";
    // @ts-ignore
    await handler(badDebutEvent).then((response) => {
      expect(response?.body).toMatch(/refresh this page.*try again later/i);
      expect(response?.body).toMatch(
        /tell your administrator an error occurred.*:.*:/i
      );
    });
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/index workbook.*failed/i)
    );
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/missing workflowId/i)
    );
  });

  it("it calls getAssessmentData with correct params", async () => {
    expect.assertions(1);
    // @ts-ignore
    await handler(dummyDebutEvent);
    expect(getAssessmentDataSpy).toHaveBeenCalledWith(candidateId, workflowId);
  });

  it("it warns and returns default html if debutWorkbook errors", async () => {
    expect.assertions(4);
    debutWorkbookSpy.mockRejectedValueOnce(new Error("debutWorkbook fault"));
    getAssessmentDataSpy.mockResolvedValueOnce(undefined);
    // @ts-ignore
    await handler(dummyDebutEvent).then((response) => {
      expect(response?.body).toMatch(/refresh this page.*try again later/i);
      expect(response?.body).toMatch(
        /tell your administrator an error occurred.*:.*:/i
      );
    });
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/debutWorkbook/i)
    );
  });

  it("it calls debutWorkbook when assessmentData is undefined", async () => {
    expect.assertions(2);
    getAssessmentDataSpy.mockResolvedValueOnce(undefined);
    // @ts-ignore
    await handler(dummyDebutEvent);
    expect(debutWorkbookSpy).toHaveBeenCalledWith(
      candidateId,
      workflowId,
      dummyDebutEvent.headers.authorization
    );
    expect(unansweredWorksheetArrSpy).not.toBeCalled();
  });

  it("it calls achievedWorkbook when assessmentData is achieved", async () => {
    expect.assertions(3);
    getAssessmentDataSpy.mockResolvedValueOnce(achievedAssessmentData);
    // @ts-ignore
    await handler(dummyDebutEvent);
    expect(achievedWorkbookSpy).toHaveBeenCalledWith(candidateId, workflowId);
    expect(unansweredWorksheetArrSpy).toBeCalled();
    expect(unansweredWorksheetArrSpy).toBeCalledWith(
      achievedAssessmentData.workflow,
      achievedAssessmentData.submissionsArr
    );
  });

  it("it warns and returns default html if achievedWorkbook errors when achieved", async () => {
    expect.assertions(4);
    achievedWorkbookSpy.mockRejectedValueOnce(
      new Error("achievedWorkbook fault")
    );
    getAssessmentDataSpy.mockResolvedValueOnce(achievedAssessmentData);
    // @ts-ignore
    await handler(dummyDebutEvent).then((response) => {
      expect(response?.body).toMatch(/refresh this page.*try again later/i);
      expect(response?.body).toMatch(
        /tell your administrator an error occurred.*:.*:/i
      );
    });
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/achievedWorkbook/i)
    );
  });

  it("it calls ongoingWorkbook when assessmentData is ongoing", async () => {
    expect.assertions(3);
    getAssessmentDataSpy.mockResolvedValueOnce(ongoingAssessmentData);
    // @ts-ignore
    await handler(dummyOngoingEvent);
    expect(ongoingWorkbookSpy).toHaveBeenCalledWith(
      ongoingAssessmentData,
      dummyOngoingEvent.body
    );
    expect(unansweredWorksheetArrSpy).toBeCalled();
    expect(unansweredWorksheetArrSpy).toBeCalledWith(
      ongoingAssessmentData.workflow,
      ongoingAssessmentData.submissionsArr
    );
  });

  //
});
