import { getItem } from "../getItem";
import { validStringArray } from "../validStringArray";

export async function getWorkflow(workflowId: string): Promise<string[]> {
  try {
    const data = await getItem(workflowId, workflowId);
    const x = data?.workflow;
    const workflow = validStringArray(x);
    return workflow;
  } catch (err) {
    throw new Error(`Get-workflow failed:- ${err} `);
  }
}
