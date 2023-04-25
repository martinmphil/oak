import { getItem } from "../dynamoUtils";

export async function getWorkflowTitle(workflowId: string): Promise<string> {
  const data = await getItem(workflowId, workflowId).catch((err) => {
    console.warn(`In get-workflow-title, get-item failed:- ${err} `);
  });

  const title = data?.workflowTitle;

  if (typeof title === "string" && title.length > 0) {
    return title;
  }

  return workflowId;
}
