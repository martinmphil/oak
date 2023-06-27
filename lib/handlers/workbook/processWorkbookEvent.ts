import { achievedWorkbook } from "./achievedWorkbook";
import { getWorksheetMarkup } from "./getWorksheetMarkup";
import { updateSubmissions } from "./updateSubmissions";

export async function processWorkbookEvent(
  candidateId: string,
  workflowId: string,
  maybeWorkbookEvent: any,
  unansweredArr: string[]
) {
  try {
    if (
      maybeWorkbookEvent &&
      maybeWorkbookEvent.workbookEvent &&
      maybeWorkbookEvent.workbookEvent.worksheetId &&
      typeof maybeWorkbookEvent.workbookEvent.worksheetId === "string" &&
      maybeWorkbookEvent.workbookEvent.worksheetId.length > 0 &&
      maybeWorkbookEvent.workbookEvent.candidateAnswer &&
      typeof maybeWorkbookEvent.workbookEvent.candidateAnswer === "string" &&
      maybeWorkbookEvent.workbookEvent.candidateAnswer.length > 0
    ) {
      const worksheetId: string = maybeWorkbookEvent.workbookEvent.worksheetId;
      const candidateAnswer: string =
        maybeWorkbookEvent.workbookEvent.candidateAnswer;

      await updateSubmissions(
        candidateId,
        workflowId,
        worksheetId,
        candidateAnswer
      );

      const updatedUnasweredArr = unansweredArr.filter(
        (el) => el != worksheetId
      );

      if (updatedUnasweredArr.length === 0) {
        const achievedMarkup = await achievedWorkbook(candidateId, workflowId);
        return achievedMarkup;
      }

      const markup = await getWorksheetMarkup(
        workflowId,
        updatedUnasweredArr[0]
      );

      return markup;
    }
    return "";
  } catch (err) {
    throw new Error(` processWorkbookEvent failed:- ${err} `);
  }
}
