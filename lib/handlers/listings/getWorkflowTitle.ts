import { getItem } from "../dynamoUtils";

export async function getWorkflowTitle(workflowId: string): Promise<string> {
  const data = await getItem(workflowId, workflowId);
  const title = data?.workflowTitle;

  if (typeof title === "string" && title.length > 0) {
    return title;
  }

  return "";
}
