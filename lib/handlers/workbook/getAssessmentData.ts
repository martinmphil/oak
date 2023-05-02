import { getItem } from "../getItem";

export async function getAssessmentData(
  candidateId: string,
  workflowId: string
) {
  const data = await getItem(candidateId, workflowId).catch((err) => {
    throw new Error(`
In getAssessmentData(${candidateId}, ${workflowId}), getItem failed:- ${err} 
    `);
  });

  return data;
}
