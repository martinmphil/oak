import { formatAchieved } from "./formatAchieved";
import { getAssessmentData } from "./getAssessmentData";
import { gradeAssessmentData } from "./gradeAssessmentData";

export async function achievedWorkbook(
  candidateId: string,
  workflowId: string
) {
  try {
    const assessmentData = await getAssessmentData(candidateId, workflowId);

    if (assessmentData && assessmentData?.grade) {
      return formatAchieved(assessmentData);
    }

    if (assessmentData) {
      const graded = await gradeAssessmentData(assessmentData);
      return formatAchieved(graded);
    }

    return formatAchieved();
  } catch (err) {
    throw new Error(
      ` achievedWorkbook(${candidateId}, ${workflowId})) failed:- ${err} `
    );
  }
}
