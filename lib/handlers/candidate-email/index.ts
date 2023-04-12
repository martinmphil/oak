// from @types
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  try {
    const AccessToken = event?.headers?.authorization;
    const client = new CognitoIdentityProviderClient({ region: "eu-west-1" });
    const body = await client
      .send(new GetUserCommand({ AccessToken }))
      .then((cogUser) => {
        if (cogUser.UserAttributes) {
          const email = cogUser.UserAttributes.find(
            (x) => x.Name === "email"
          )?.Value;

          if (typeof email === "string" && email.length > 1) {
            return email;
          }
        }
        throw new Error(
          " Our databank failed to find candidate email address. "
        );
      });

    return { body };
  } catch (err) {
    let fault = ` The candidate-email lambda function failed. `;
    if (err) {
      fault += ` ${err.toString()} `;
    }
    return { fault };
  }
}
