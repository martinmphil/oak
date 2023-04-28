import { getItem } from "../getItem";

export async function getWorkflowProgress(
  candidateId: string,
  workflowId: string
) {
  const data = await getItem(candidateId, workflowId).catch((err) => {
    console.warn(`
In getWorkflowProgress(${candidateId}, ${workflowId}), getItem failed:- ${err} 
`);
  });

  const maybeIndex = data?.workflowIndex;

  if (typeof maybeIndex === "number" && maybeIndex < 0) {
    return "achieved";
  }

  if (typeof maybeIndex === "number") {
    return "ongoing";
  }

  return "upcoming";
}
