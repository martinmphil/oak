import { getItem } from "../getItem";
import { unansweredWorksheetArr } from "../unansweredWorksheetArr";

export async function getWorkflowProgress(
  candidateId: string,
  workflowId: string
) {
  const assessmentData = await getItem(candidateId, workflowId).catch((err) => {
    console.warn(`
In getWorkflowProgress(${candidateId}, ${workflowId}), getItem failed:- ${err} 
`);
  });

  const workflow = assessmentData?.workflow;
  const submissionsArr = assessmentData?.submissionsArr;

  if (
    assessmentData &&
    Array.isArray(workflow) &&
    Array.isArray(submissionsArr) &&
    unansweredWorksheetArr(workflow, submissionsArr).length === 0
  ) {
    return "achieved";
  }

  if (
    assessmentData &&
    Array.isArray(workflow) &&
    unansweredWorksheetArr(workflow, submissionsArr).length > 0
  ) {
    return "ongoing";
  }

  return "upcoming";
}
