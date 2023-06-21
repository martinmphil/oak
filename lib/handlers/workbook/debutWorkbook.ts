import { putDebutAssessmentData } from "./putDebutAssessmentData";
import { getWorkflow } from "./getWorkflow";
import { getWorksheetMarkup } from "./getWorksheetMarkup";
import { getEmailAddr } from "./getEmailAddr";

export async function debutWorkbook(
  candidateId: string,
  workflowId: string,
  AccessToken?: string
) {
  try {
    const workflow = await getWorkflow(workflowId);
    const html = await getWorksheetMarkup(workflowId, workflow[0]);

    const candidateEmailAdrr = await getEmailAddr(AccessToken);

    await putDebutAssessmentData(
      candidateId,
      workflowId,
      workflow,
      candidateEmailAdrr
    );

    return html;
  } catch (err) {
    throw new Error(` debutWorkbook failed:- ${err} `);
  }
}
