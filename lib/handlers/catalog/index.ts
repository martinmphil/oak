// from @types
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";

import { getItem } from "../dynamo_utils";

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const happyDbResult = await getItem("standardCatalog", "standardCatalog");

  const dbItem = JSON.stringify(happyDbResult);

  return {
    body: `
You successfully invoked the catalog lambda from oak stack. 
With datbase name ${process.env.DATABASE_NAME_OAK}, 
and datbase item ${dbItem}} 
and catalog ${happyDbResult?.obj.catalog[0]}. 
    `,
  };
}
