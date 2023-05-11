// from @types
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

import { getAssessmentData } from "./getAssessmentData";
import { achievedWorkbook } from "./achievedWorkbook";
import { ongoingWorkbook } from "./ongoingWorkbook";
import { debutWorkbook } from "./debutWorkbook";
import { unansweredWorksheetArr } from "../unansweredWorksheetArr";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  let fault = `The index-workbook lambda function failed. `;
  let body = `
<p>
Sorry we encountered a fault. Either refresh this page, try again later, 
or tell your administrator an error occurred at ${new Date().toUTCString()}.
</p>
`;

  try {
    const username = event?.requestContext?.authorizer?.jwt?.claims?.username;
    const workbookEventJson = event?.body;

    if (typeof username !== "string" || username.length === 0) {
      fault += " Missing username. ";
      console.warn(fault);
      return { body };
    }
    const candidateId = `candidate-${username}`;

    if (
      typeof event?.pathParameters?.workflowId !== "string" ||
      event?.pathParameters?.workflowId.length === 0
    ) {
      fault += `Missing workflowId for ${candidateId}. `;
      console.warn(fault);
      return { body };
    }
    const workflowId = event?.pathParameters?.workflowId;

    // Workbook splits into three streams:
    // achievedWorkbook, ongoingWorkbook & (default) debutWorkbook.

    const assessmentData = await getAssessmentData(candidateId, workflowId);
    const workflow = assessmentData?.workflow;
    const submissionsArr = assessmentData?.submissionsArr;

    if (
      assessmentData &&
      Array.isArray(workflow) &&
      Array.isArray(submissionsArr) &&
      unansweredWorksheetArr(workflow, submissionsArr).length === 0
    ) {
      const achievedMarkup = await achievedWorkbook(candidateId, workflowId);
      return { body: achievedMarkup };
    }

    if (
      assessmentData &&
      Array.isArray(workflow) &&
      unansweredWorksheetArr(workflow, submissionsArr).length > 0
    ) {
      const ongoingMarkup = await ongoingWorkbook(
        assessmentData,
        workbookEventJson
      );
      return { body: ongoingMarkup };
    }

    const debutMarkup = await debutWorkbook(candidateId, workflowId);
    return { body: debutMarkup };
    //
  } catch (err) {
    console.warn(`${fault}:- ${err}`);
    return { body };
  }
}
