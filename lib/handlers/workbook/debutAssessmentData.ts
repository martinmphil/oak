import { putItem } from "../putItem";
const timestamp = new Date().toISOString();

export async function debutAssessmentData(
  candidateId: string,
  workflowId: string,
  workflow: string[]
) {
  const Item = {
    pk: candidateId,
    sk: workflowId,
    entityType: "assessmentData",
    workflow,
    workflowIndex: 0,
    createdAt: timestamp,
  };

  const result = await putItem(Item).catch((err) => {
    throw new Error(
      `debutAssessmentData failed to put Item ${JSON.stringify(
        Item
      )}}:- ${err} `
    );
  });

  return result;
}
