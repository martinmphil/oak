import { validStringArray } from "../validStringArray";
import { getWorksheetMarkup } from "./getWorksheetMarkup";
import { processWorkbookEvent } from "./processWorkbookEvent";
import { unansweredWorksheetArr } from "../unansweredWorksheetArr";

export async function ongoingWorkbook(
  assessmentData: Record<string, any> | undefined,
  workbookEventJson?: string | undefined
) {
  try {
    if (Boolean(assessmentData) === false) {
      throw new Error(" Missing assessmentData. ");
    }

    if (
      typeof assessmentData?.pk != "string" ||
      assessmentData?.pk.length === 0
    ) {
      throw new Error(" Missing candidateId. ");
    }
    const candidateId = assessmentData.pk;

    if (
      typeof assessmentData?.sk != "string" ||
      assessmentData?.sk.length === 0
    ) {
      throw new Error(" Missing workflowId. ");
    }
    const workflowId = assessmentData.sk;

    const workflow = validStringArray(assessmentData?.workflow);

    let unansweredArr = workflow;
    if (assessmentData.submissionsArr) {
      unansweredArr = unansweredWorksheetArr(
        workflow,
        assessmentData.submissionsArr
      );
    }

    if (workbookEventJson) {
      const maybeWorkbookEvent = JSON.parse(workbookEventJson);
      const eventProcessedMarkup = await processWorkbookEvent(
        candidateId,
        workflowId,
        maybeWorkbookEvent,
        unansweredArr
      );
      if (
        typeof eventProcessedMarkup === "string" &&
        eventProcessedMarkup.length > 0
      ) {
        return eventProcessedMarkup;
      }
    }

    const firstUnanswered = unansweredArr[0];
    const firstUnansweredMarkup = await getWorksheetMarkup(
      workflowId,
      firstUnanswered
    );
    return firstUnansweredMarkup;
  } catch (err) {
    throw new Error(
      ` ongoingWorkbook(${JSON.stringify(assessmentData)}, ${JSON.stringify(
        workbookEventJson
      )}) failed. :- ${err} `
    );
  }
}
