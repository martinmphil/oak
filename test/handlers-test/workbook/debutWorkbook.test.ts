import { debutWorkbook } from "../../../lib/handlers/workbook/debutWorkbook";
import * as getEmailAddrMod from "../../../lib/handlers/workbook/getEmailAddr";
import * as getWorkflowMod from "../../../lib/handlers/workbook/getWorkflow";
import * as getWorksheetMarkupMod from "../../../lib/handlers/workbook/getWorksheetMarkup";
import * as putDebutAssessmentDataMod from "../../../lib/handlers/workbook/putDebutAssessmentData";

describe("debutWorkbook", () => {
  const candidateId = "can333";
  const workflowId = "wflow101";
  const workflow = ["worksheet1", "worksheet2"];
  const dummyHtml = `<div>dummy</div>`;
  const candidateEmailAdrr = "dummy@example.com";

  const getWorkflowSpy = jest.spyOn(getWorkflowMod, "getWorkflow");

  const getWorksheetMarkupSpy = jest.spyOn(
    getWorksheetMarkupMod,
    "getWorksheetMarkup"
  );

  const putDebutAssessmentDataSpy = jest.spyOn(
    putDebutAssessmentDataMod,
    "putDebutAssessmentData"
  );

  const getEmailAddrSpy = jest.spyOn(getEmailAddrMod, "getEmailAddr");

  beforeEach(() => {
    jest.clearAllMocks();
    getWorkflowSpy.mockResolvedValue(workflow);
    getWorksheetMarkupSpy.mockResolvedValue(dummyHtml);
    getEmailAddrSpy.mockResolvedValue(candidateEmailAdrr);
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
    const repsonse = await debutWorkbook(
      candidateId,
      workflowId,
      "dummyAccessToken"
    );
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

  it("calls getEmailAdrr with correct argument", async () => {
    expect.assertions(4);
    const repsonse = await debutWorkbook(
      candidateId,
      workflowId,
      "dummyAccessToken"
    );
    expect(repsonse).toMatch(dummyHtml);
    expect(getEmailAddrSpy).toBeCalled();
    expect(getEmailAddrSpy).toBeCalledTimes(1);
    expect(getEmailAddrSpy).toBeCalledWith("dummyAccessToken");
  });

  it("calls debutAssessmentData with correct arguments", async () => {
    expect.assertions(4);
    const repsonse = await debutWorkbook(candidateId, workflowId);
    expect(repsonse).toMatch(dummyHtml);
    expect(putDebutAssessmentDataSpy).toHaveBeenCalled();
    expect(putDebutAssessmentDataSpy).toHaveBeenCalledTimes(1);
    expect(putDebutAssessmentDataSpy).toHaveBeenCalledWith(
      candidateId,
      workflowId,
      workflow,
      candidateEmailAdrr
    );
  });

  it("throws an error if the debutAssessmentData fails", async () => {
    expect.assertions(3);
    putDebutAssessmentDataSpy.mockRejectedValueOnce(
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
