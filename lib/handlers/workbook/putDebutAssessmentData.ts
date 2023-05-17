import { getWorkflowTitle } from "../getWorkflowTitle";
import { putItem } from "../putItem";
const timestamp = new Date().toISOString();

export async function putDebutAssessmentData(
  candidateId: string,
  workflowId: string,
  workflow: string[],
  candidateEmailAdrr: string
) {
  try {
    const workflowTitle = await getWorkflowTitle(workflowId);

    const Item = {
      pk: candidateId,
      sk: workflowId,
      entityType: "assessmentData",
      workflowTitle,
      workflow,
      candidateEmailAdrr,
      createdAt: timestamp,
      updatedAt: timestamp,
      submissionsArr: [],
    };

    const result = await putItem(Item);

    return result;
  } catch (err) {
    throw new Error(
      ` putDebutAssessmentData(${candidateId}, ${workflowId}, ${workflow}) failed:- ${err} `
    );
  }
}
