import { formatAchieved } from "../../../lib/handlers/workbook/formatAchieved";

import { dummyAchievedAssessmentData } from "./dummyAchievedAssessmentData";

describe("formatAchieve", () => {
  it("exists", () => {
    expect(formatAchieved).toBeDefined();
    expect(formatAchieved).toBeInstanceOf(Function);
  });

  it("can return default html", () => {
    const result = formatAchieved(undefined);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(1);
    expect(result).toMatch(/you/i);
    expect(result).toMatch(/achieved completion/i);
    expect(result).toMatch(/in this subject/i);
  });

  it("fomats achievement", () => {
    const result = formatAchieved(dummyAchievedAssessmentData);
    expect(result).toMatch(/May/);
    expect(result).toMatch(dummyAchievedAssessmentData.candidateEmailAdrr);
    expect(result).toMatch(dummyAchievedAssessmentData.grade);
    expect(result).toMatch(dummyAchievedAssessmentData.workflowTitle);
  });

  //
});
