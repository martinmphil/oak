// from @types
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { putItem } from "../lambda_utils";

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const happyDbResult = await putItem("testPk", "testSk", {
    newAttribute: "testValue",
  });

  const dbItem = JSON.stringify(happyDbResult);

  return {
    body: `
You successfully invoked lambda exam from oak stack. 
With datbase name ${process.env.DATABASE_NAME_OAK}, 
and database return value of ${JSON.stringify(happyDbResult)}. 
    `,
  };
}
