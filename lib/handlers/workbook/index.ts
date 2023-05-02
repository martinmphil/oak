// from @types
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

import { getAssessmentData } from "./getAssessmentData";
import { achievedWorkbook } from "./achievedWorkbook";
import { ongoingWorkbook } from "./ongoingWorkbook";
import { debutWorkbook } from "./debutWorkbook";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  // TEMP
  // Until I get a dummy event with a body upload
  // ie for testing copy ongoingDummyEvent
  console.log("ongoingDummyEvent is...👉");
  console.log(event);
  //

  let fault = `The index-workbook lambda function failed. `;
  let body = `
<p>
Sorry we encountered a fault. Either refresh this page, try again later, 
or tell your administrator an error occurred at ${new Date().toUTCString()}.
</p>
`;

  try {
    const username = event?.requestContext?.authorizer?.jwt?.claims?.username;
    const maybeAnswer = event?.body;

    if (typeof username !== "string" || username.length === 0) {
      fault += "Missing username. ";
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
    const maybeAssessmentData = await getAssessmentData(
      candidateId,
      workflowId
    );
    const maybeIndex = maybeAssessmentData?.workflowIndex;
    if (typeof maybeIndex === "number" && maybeIndex < 0) {
      const achievedMarkup = await achievedWorkbook(candidateId, workflowId);
      return { body: achievedMarkup };
    }
    if (typeof maybeIndex === "number") {
      let answer = "";
      if (typeof maybeAnswer === "string" && maybeAnswer.length > 0) {
        answer = maybeAnswer;
      }
      const ongoingMarkup = await ongoingWorkbook(maybeAssessmentData, answer);
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
