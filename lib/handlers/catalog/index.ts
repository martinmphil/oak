// from @types
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

import { getCatalog } from "./getCatalog";
import { listings } from "./listings";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  try {
    const defaultMarkup = `
    <p>
    If you expected to find your enrolled subjects here, 
    then please contact your Administrator. 
    </p>
    `;
    const username = event.requestContext.authorizer.jwt.claims.username;
    const candidateId = `candidate-${username}`;

    const catalog = await getCatalog(candidateId);

    if (catalog.length === 1 && catalog[0] === "") {
      return { body: defaultMarkup };
    }

    const markup = await listings(candidateId, catalog);

    if (typeof markup === "string" && markup.length > 0) {
      return { body: markup };
    }

    return { body: defaultMarkup };
  } catch (err) {
    let fault = ` The index catalog lambda function failed. `;

    if (err) {
      fault += ` ${err.toString()} `;
    }
    return { fault };
  }
}
