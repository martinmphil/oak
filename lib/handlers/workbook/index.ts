// from @types
import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { putItem } from "../dynamoUtils";

export async function handler(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> {
  const happyDbResult = await putItem({
    pk: "dummyPk",
    sk: "dummySk",
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
