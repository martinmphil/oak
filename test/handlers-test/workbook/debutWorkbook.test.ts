import { debutWorkbook } from "../../../lib/handlers/workbook/debutWorkbook";
import * as getWorkflowMod from "../../../lib/handlers/workbook/getWorkflow";
import * as getWorksheetMarkupMod from "../../../lib/handlers/workbook/getWorksheetMarkup";
import * as putDebutAssessmentDataMod from "../../../lib/handlers/workbook/putDebutAssessmentData";

describe("debutWorkbook", () => {
  const candidateId = "can333";
  const workflowId = "wflow101";
  const workflow = ["wsheet001", "wsheet002"];
  const dummyHtml = `<div>dummy</div>`;
  const getWorkflowSpy = jest.spyOn(getWorkflowMod, "getWorkflow");
  const getWorksheetMarkupSpy = jest.spyOn(
    getWorksheetMarkupMod,
    "getWorksheetMarkup"
  );
  const debutAssessmentDataSpy = jest.spyOn(
    putDebutAssessmentDataMod,
    "putDebutAssessmentData"
  );

  beforeEach(() => {
    jest.clearAllMocks();
    getWorkflowSpy.mockResolvedValue(workflow);
    getWorksheetMarkupSpy.mockResolvedValue(dummyHtml);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("exists", () => expect(debutWorkbook).toBeDefined());

  it("returns a promise", () => {
    expect.assertions(1);
    expect(debutWorkbook(candidateId, workflowId)).resolves.not.toThrow();
  });

  it("resolves to a string", async () => {
    expect.assertions(3);
    const repsonse = await debutWorkbook(candidateId, workflowId);
    expect(typeof repsonse).toBe("string");
    expect(repsonse.length).toBeGreaterThan(0);
    expect(repsonse).toMatch(dummyHtml);
  });

  it("calls getWorkflow with correct arguments", () => {
    expect.assertions(2);
    debutWorkbook(candidateId, workflowId);
    expect(getWorkflowSpy).toHaveBeenCalledTimes(1);
    expect(getWorkflowSpy).toHaveBeenCalledWith(workflowId);
  });

  it("throws an error if the getWorkflow fails", async () => {
    expect.assertions(3);
    getWorkflowSpy.mockRejectedValueOnce("getWorkflow failed" as any);
    await debutWorkbook(candidateId, workflowId).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/getWorkflow failed/i);
      expect(err.message).toMatch(/debutWorkbook failed/i);
    });
  });

  it("calls getWorksheetMarkup with correct arguments", async () => {
    expect.assertions(4);
    const repsonse = await debutWorkbook(candidateId, workflowId);
    expect(repsonse).toMatch(dummyHtml);
    expect(getWorksheetMarkupSpy).toHaveBeenCalled();
    expect(getWorksheetMarkupSpy).toHaveBeenCalledTimes(1);
    expect(getWorksheetMarkupSpy).toHaveBeenCalledWith(workflowId, workflow[0]);
  });

  it("throws an error if the getWorksheetMarkup fails", async () => {
    expect.assertions(3);
    getWorksheetMarkupSpy.mockRejectedValueOnce(
      "getWorksheetMarkup failed" as any
    );
    await debutWorkbook(candidateId, workflowId).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/getWorksheetMarkup failed/i);
      expect(err.message).toMatch(/debutWorkbook failed/i);
    });
  });

  it("calls debutAssessmentData with correct arguments", async () => {
    expect.assertions(4);
    const repsonse = await debutWorkbook(candidateId, workflowId);
    expect(repsonse).toMatch(dummyHtml);
    expect(debutAssessmentDataSpy).toHaveBeenCalled();
    expect(debutAssessmentDataSpy).toHaveBeenCalledTimes(1);
    expect(debutAssessmentDataSpy).toHaveBeenCalledWith(
      candidateId,
      workflowId,
      workflow
    );
  });

  it("throws an error if the debutAssessmentData fails", async () => {
    expect.assertions(3);
    debutAssessmentDataSpy.mockRejectedValueOnce(
      "debutAssessmentData failed" as any
    );
    await debutWorkbook(candidateId, workflowId).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/debutAssessmentData failed/i);
      expect(err.message).toMatch(/debutWorkbook failed/i);
    });
  });

  //
});
