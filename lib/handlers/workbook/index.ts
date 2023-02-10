// from @types
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { putItem } from "../database_utils";

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const happyDbResult = await putItem({
    pk: "dummyPk",
    sk: "dummySk",
    newAttribute: "dummyValue",
  });

  const dbItem = JSON.stringify(happyDbResult);

  return {
    body: `
You successfully invoked lambda workbook from oak stack. 
With datbase name ${process.env.DATABASE_NAME_OAK}, 
and database return value of ${JSON.stringify(happyDbResult)}. 
    `,
  };
}
