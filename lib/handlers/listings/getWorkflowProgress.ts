import { getItem } from "../getItem";

export async function getWorkflowProgress(
  candidateId: string,
  workflowId: string
) {
  const data = await getItem(candidateId, workflowId).catch((err) => {
    console.warn(`In get-workflow-progress, get-item failed:- ${err} `);
  });
  const workProgress = Number(data?.workProgress);

  if (typeof workProgress === "number" && !Number.isNaN(workProgress)) {
    return workProgress;
  }

  return 0;
}
