// from @types
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

import { getCatalog } from "./getCatalog";
import { listingsMarkup } from "./listingsMarkup";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
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
      throw new Error("Missing username. ");
    }

    const catalog = await getCatalog(candidateId);

    const markup = await listingsMarkup(candidateId, catalog);

    if (typeof markup === "string" && markup.length > 0) {
      body = markup;
    }

    return { body };
  } catch (err) {
    console.warn(`The index catalog lambda function failed:- ${err} `);
    return { body };
  }
}
