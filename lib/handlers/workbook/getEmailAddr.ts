import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export async function getEmailAddr(AccessToken: unknown) {
  let fault = ` The workbook getEmailAddr(${JSON.stringify(
    AccessToken
  )}) failed. `;

  try {
    if (!AccessToken || typeof AccessToken != "string") {
      return "";
    }
    const client = new CognitoIdentityProviderClient({ region: "eu-west-1" });
    const emailAddr = await client
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

    return emailAddr;
  } catch (err) {
    fault += err;
    console.warn(fault);
    return "";
  }
}
