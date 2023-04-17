import { getItem } from "../dynamoUtils";

export async function getWorkflowProgress(
  candidateId: string,
  workflowId: string
): Promise<number> {
  const data = await getItem(candidateId, workflowId);
  const workProgress = Number(data?.workProgress);

  if (typeof workProgress === "number" && !Number.isNaN(workProgress)) {
    return workProgress;
  }

  return 0;
}
