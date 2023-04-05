// from @types
import { PostConfirmationTriggerEvent } from "aws-lambda";

import { getStandardCatalog } from "./getStandardCatalog";
import { putCatalog } from "./putCatalog";

export async function handler(event: PostConfirmationTriggerEvent) {
  try {
    // Returning the event continues AWS hosted-UI sign-up process.
    // Cognito-attribute "sub" (ie subject) uniquely identifies each user.
    const username = event?.request?.userAttributes?.sub;
    const canId = `candidate-${username}`;
    const standardCatalog = await getStandardCatalog();
    if (standardCatalog[0].length < 1) {
      console.warn(` Standard catalog is empty. `);
      return event;
    }
    await putCatalog(canId, standardCatalog);
  } catch (err) {
    console.warn(` Cognito-post-confirm failed:- ${JSON.stringify(err)}. `);
  }
  return event;
}
