import { putItem } from "../putItem";
const timestamp = new Date().toISOString();

export async function putDebutAssessmentData(
  candidateId: string,
  workflowId: string,
  workflow: string[]
) {
  const Item = {
    pk: candidateId,
    sk: workflowId,
    entityType: "assessmentData",
    workflow,
    createdAt: timestamp,
    updatedAt: timestamp,
    submissionsArr: [],
  };

  const result = await putItem(Item).catch((err) => {
    throw new Error(
      ` putDebutAssessmentData failed to put Item ${JSON.stringify(
        Item
      )}}:- ${err} `
    );
  });

  return result;
}
