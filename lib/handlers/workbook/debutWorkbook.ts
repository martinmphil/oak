import { putDebutAssessmentData } from "./putDebutAssessmentData";
import { getWorkflow } from "./getWorkflow";
import { getWorksheetMarkup } from "./getWorksheetMarkup";

export async function debutWorkbook(candidateId: string, workflowId: string) {
  try {
    const workflow = await getWorkflow(workflowId);
    const html = await getWorksheetMarkup(workflowId, workflow[0]);

    await putDebutAssessmentData(candidateId, workflowId, workflow);

    return html;
  } catch (err) {
    throw new Error(` debutWorkbook failed:- ${err} `);
  }
}
