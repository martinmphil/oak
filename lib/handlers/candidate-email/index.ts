// from @types
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  try {
    if (!event?.headers?.authorization) {
      throw new Error(` Missing authorization header. `);
    }
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
        throw new Error(" Cognito failed to find candidate email address. ");
      })
      .catch((err) => {
        throw new Error(` Cognito GetUserCommand failed:- ${err} `);
      });

    return { body };
  } catch (err) {
    const error = ` The index candidate-email lambda function failed:- ${err} `;
    console.warn(error);
    return { error };
  }
}
