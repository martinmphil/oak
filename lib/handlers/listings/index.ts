// from @types
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

import { getCatalog } from "./getCatalog";
import { listingsMarkup } from "./listingsMarkup";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  let fault = ` The index catalog lambda function failed. `;
  let body = `
<p>
If you expected to find your enrolled subjects here, 
then either refresh this page, try again later, 
or tell your administrator an error occurred at ${new Date().toUTCString()}.
</p>
  `;

  try {
    const username = event?.requestContext?.authorizer?.jwt?.claims?.username;
    const candidateId = `candidate-${username}`;

    if (typeof username !== "string" || username.length === 0) {
      fault += " Missing username. ";
      console.warn(fault);
      return { body };
    }

    const catalog = await getCatalog(candidateId);

    if (catalog.length === 1 && catalog[0] === "") {
      return { body };
    }

    const markup = await listingsMarkup(candidateId, catalog);
    if (typeof markup === "string" && markup.length > 0) {
      body = markup;
    }

    return { body };
  } catch (err) {
    if (err) {
      fault += ` ${err.toString()} `;
    }
    console.warn(fault);
    return { fault };
  }
}
