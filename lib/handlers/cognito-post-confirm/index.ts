// from @types
import { PostConfirmationTriggerEvent } from "aws-lambda";

import { getStandardCatalog } from "./getStandardCatalog";
import { putCatalog } from "./putCatalog";

export async function handler(event: PostConfirmationTriggerEvent) {
  // TEMP
  console.log("event 👉", event);
  //
  try {
    // Returning the event continues our hosted-UI sign-up process.
    // Cognito-attribute "sub" (ie subject) uniquely identifies each user.
    const username = event?.request?.userAttributes?.sub;
    const canId = `candidate-${username}`;
    const standardCatalog = await getStandardCatalog();
    if (standardCatalog.length < 1) {
      console.warn(` The standard catalog is empty. `);
      return event;
    }
    await putCatalog(canId, standardCatalog);
  } catch (err) {
    console.warn(` Cognito-post-confirm failed:- ${JSON.stringify(err)}. `);
  }
  return event;
}
