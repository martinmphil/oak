// from @types
import { PostConfirmationTriggerEvent } from "aws-lambda";

import { getStandardCatalog } from "./getStandardCatalog";
import { putCatalog } from "./putCatalog";
import { validStringArray } from "../validStringArray";

export async function handler(event: PostConfirmationTriggerEvent) {
  let fault = `Cognito-post-confirm lambda failed. `;

  try {
    // Returning the event continues AWS hosted-UI sign-up process.
    // Cognito-attribute "sub" (ie subject) uniquely identifies each user.
    const username = event?.request?.userAttributes?.sub;
    const candidateId = `candidate-${username}`;

    if (typeof username !== "string" || username.length === 0) {
      fault += " Missing username. ";
      console.warn(fault);
      return event;
    }

    const standardCatalog = await getStandardCatalog().catch((err) => {
      fault += `Standard catalog is empty. ${err} `;
      console.warn(fault);
      return event;
    });

    await putCatalog(candidateId, validStringArray(standardCatalog)).catch(
      (err) => {
        fault += `We failed to put standard catalog into our databank. ${err} `;
        console.warn(fault);
        return event;
      }
    );
  } catch (err) {
    console.warn(`${fault}:- ${err}`);
    return event;
  }
  return event;
}
