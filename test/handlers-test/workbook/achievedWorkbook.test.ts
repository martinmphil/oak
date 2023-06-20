import { achievedWorkbook } from "../../../lib/handlers/workbook/achievedWorkbook";
import * as formatAchieveMod from "../../../lib/handlers/workbook/formatAchieved";
import * as getAssessmentDataMod from "../../../lib/handlers/workbook/getAssessmentData";
import * as gradeAssessmentDataMod from "../../../lib/handlers/workbook/gradeAssessmentData";
import { dummyAchievedAssessmentData } from "./dummyAchievedAssessmentData";
import { dummyUngradedAssessmentData } from "./dummyUngradedAssessmentData";

describe("achievedWorkbook", () => {
  const candidateId = "candidate-dummy_username";
  const workflowId = "workflow101";

  const getAssessmentDataSpy = jest.spyOn(
    getAssessmentDataMod,
    "getAssessmentData"
  );

  const formatAchieveSpy = jest.spyOn(formatAchieveMod, "formatAchieved");

  const gradeAssessmentDataSpy = jest.spyOn(
    gradeAssessmentDataMod,
    "gradeAssessmentData"
  );

  beforeEach(() => {
    getAssessmentDataSpy.mockResolvedValue(dummyUngradedAssessmentData);
    gradeAssessmentDataSpy.mockResolvedValue(dummyAchievedAssessmentData);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("exists", () => {
    expect(achievedWorkbook).toBeDefined();
  });

  it("returns a promise", () => {
    expect.assertions(1);
    getAssessmentDataSpy.mockResolvedValue(dummyAchievedAssessmentData);
    expect(achievedWorkbook(candidateId, workflowId)).resolves.not.toThrow();
  });

  it("can return default html", async () => {
    expect.assertions(3);
    getAssessmentDataSpy.mockResolvedValueOnce(undefined);
    const result = await achievedWorkbook(candidateId, workflowId);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(1);
    expect(result).toMatch(/achieved completion/i);
  });

  it("it calls getAssessmentData", async () => {
    expect.assertions(1);
    await achievedWorkbook(candidateId, workflowId);
    expect(getAssessmentDataSpy).toHaveBeenCalledWith(candidateId, workflowId);
  });

  it("calls formatAchieve via dummyAchievedAssessmentData", async () => {
    expect.assertions(1);
    getAssessmentDataSpy.mockResolvedValueOnce(dummyAchievedAssessmentData);
    await achievedWorkbook(candidateId, workflowId);
    expect(formatAchieveSpy).toBeCalledWith(dummyAchievedAssessmentData);
  });

  //
});
