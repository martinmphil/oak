// from @types
import { PostConfirmationTriggerEvent } from "aws-lambda";

import { getItem, putItem } from "../dynamo_utils";

// getStandardCatalog()
// register candidate
//   putStandardCatalog
//   putCandidateData

export async function handler(event: PostConfirmationTriggerEvent) {
  return event;
}
