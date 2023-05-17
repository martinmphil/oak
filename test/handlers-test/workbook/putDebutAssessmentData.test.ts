import { putDebutAssessmentData } from "../../../lib/handlers/workbook/putDebutAssessmentData";

import * as putItemMod from "../../../lib/handlers/putItem";
import * as getWorkflowTitleMod from "../../../lib/handlers/getWorkflowTitle";

describe("putDebutAssessmentData", () => {
  const candidateId = "can333";
  const workflowId = "workflow101";
  const workflow = ["worksheet1", "worksheet2"];
  const candidateEmailAdrr = "dummy@example.com";

  const putItemSpy = jest.spyOn(putItemMod, "putItem");

  const getWorkflowTitleSpy = jest.spyOn(
    getWorkflowTitleMod,
    "getWorkflowTitle"
  );

  beforeEach(() => {
    putItemSpy.mockResolvedValue({
      $metadata: {
        httpStatusCode: 200,
        requestId: "DUMMY1",
        attempts: 1,
        totalRetryDelay: 0,
      },
    });

    getWorkflowTitleSpy.mockResolvedValue("dummy_title");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exists", () => {
    expect(putDebutAssessmentData).toBeDefined();
  });

  it("returns a promise", () => {
    expect.assertions(1);
    expect(
      putDebutAssessmentData(
        candidateId,
        workflowId,
        workflow,
        candidateEmailAdrr
      )
    ).resolves.not.toThrow();
  });

  it("calls getWorkflowTitle", async () => {
    expect.assertions(1);
    await putDebutAssessmentData(
      candidateId,
      workflowId,
      workflow,
      candidateEmailAdrr
    );
    expect(getWorkflowTitleSpy).toBeCalledWith(workflowId);
  });

  it("calls putItem with the correct params", async () => {
    expect.assertions(2);
    await putDebutAssessmentData(
      candidateId,
      workflowId,
      workflow,
      candidateEmailAdrr
    ).then((response) => {
      expect(response.$metadata.httpStatusCode).toBe(200);
    });
    expect(putItemSpy).toHaveBeenCalledWith({
      createdAt: expect.stringMatching(/T.*:.*:.*Z/i),
      updatedAt: expect.stringMatching(/T.*:.*:.*Z/i),
      entityType: "assessmentData",
      pk: "can333",
      sk: "workflow101",
      workflowTitle: "dummy_title",
      workflow,
      candidateEmailAdrr,
      submissionsArr: [],
    });
  });

  it("throws an error if the putItem call fails", async () => {
    expect.assertions(3);
    putItemSpy.mockRejectedValueOnce(new Error("dummy_put_item_error"));
    await putDebutAssessmentData(
      candidateId,
      workflowId,
      workflow,
      candidateEmailAdrr
    ).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/dummy_put_item_error/i);
      expect(err.message).toMatch(/putDebutAssessmentData/i);
    });
  });

  //
});
