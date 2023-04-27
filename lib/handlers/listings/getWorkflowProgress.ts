import { getItem } from "../getItem";

export async function getWorkflowProgress(
  candidateId: string,
  workflowId: string
) {
  const data = await getItem(candidateId, workflowId).catch((err) => {
    console.warn(
      `In getWorkflowProgress, getItem failed with arguments ${candidateId} and ${workflowId}:- ${err} `
    );
  });
  const workflowProgress = Number(data?.workflowProgress);

  if (typeof workflowProgress === "number" && !Number.isNaN(workflowProgress)) {
    return workflowProgress;
  }

  return 0;
}
