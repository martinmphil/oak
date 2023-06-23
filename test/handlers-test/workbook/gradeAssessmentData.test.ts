import { gradeAssessmentData } from "../../../lib/handlers/workbook/gradeAssessmentData";
import * as getItemMod from "../../../lib/handlers/getItem";
import * as putItemMod from "../../../lib/handlers/putItem";

const candidateId = "candidate-dummy_username";
const workflowId = "workflow101";
const dummyAssessmentData = {
  pk: candidateId,
  sk: workflowId,
  entityType: "assessmentData",
  workflow: ["worksheet1", "worksheet2", "worksheet3"],
  createdAt: "dummyTimestamp",
  updatedAt: "dummyTimestamp",
  submissionsArr: [
    { worksheetId: "worksheet1", candidateAnswer: "a1" },
    { worksheetId: "worksheet2", candidateAnswer: "a1" },
    { worksheetId: "worksheet3", candidateAnswer: "a1" },
  ],
};

const achievedAssessmentData = {
  pk: candidateId,
  sk: workflowId,
  entityType: "assessmentData",
  workflow: ["worksheet1", "worksheet2", "worksheet3"],
  createdAt: "dummyTimestamp",
  updatedAt: "dummyTimestamp",
  submissionsArr: [
    { worksheetId: "worksheet1", candidateAnswer: "a1", score: 1, outOf: 1 },
    { worksheetId: "worksheet2", candidateAnswer: "a1", score: 1, outOf: 1 },
    { worksheetId: "worksheet3", candidateAnswer: "a1", score: 1, outOf: 1 },
  ],
  grade: "Distinction",
};

describe("gradedAssessmentData", () => {
  const getItemSpy = jest.spyOn(getItemMod, "getItem");
  const putItemSpy = jest.spyOn(putItemMod, "putItem");

  beforeEach(() => {
    getItemSpy.mockResolvedValue({
      worksheetObj: {
        rubricArr: [
          {
            answer: "a1",
            mark: 1,
          },
        ],
      },
    });
    putItemSpy.mockResolvedValue({
      $metadata: {
        httpStatusCode: 200,
        requestId: "DUMMY1",
        attempts: 1,
        totalRetryDelay: 0,
      },
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exists", () => {
    expect(gradeAssessmentData).toBeDefined();
  });

  it("returns a promise", () => {
    expect.assertions(1);
    expect(gradeAssessmentData(dummyAssessmentData)).resolves.not.toThrow();
  });

  it("returns scored assessmentData", async () => {
    expect.assertions(1);
    const result = await gradeAssessmentData(dummyAssessmentData);
    expect(result).toEqual(achievedAssessmentData);
  });

  it("calls putItem with achievedAssessmentData", async () => {
    expect.assertions(2);
    const result = await gradeAssessmentData(dummyAssessmentData);
    expect(result).toEqual(achievedAssessmentData);
    expect(putItemSpy).toBeCalledWith(achievedAssessmentData);
  });

  //
});
