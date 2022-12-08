import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as Oak from "../lib/oak-stack";

const app = new cdk.App();
const stack = new Oak.OakStack(app, "apiTestStack");
const template = Template.fromStack(stack);

describe("cognito construct user pool", () => {
  it("DELETES on destroy command", () => {
    template.hasResource("AWS::Cognito::UserPool", {
      DeletionPolicy: "Delete",
    });
  });

  it("has a user pool called canOak", () => {
    template.hasResourceProperties("AWS::Cognito::UserPool", {
      UserPoolName: "canOak",
    });
  });

  it("allows users to self register", () => {
    template.hasResourceProperties("AWS::Cognito::UserPool", {
      AdminCreateUserConfig: Match.objectLike({
        AllowAdminCreateUserOnly: false,
      }),
    });
  });

  it("allows email sign-in", () => {
    template.hasResourceProperties("AWS::Cognito::UserPool", {
      UsernameAttributes: ["email"],
    });
  });

  it("has case insensative emails", () => {
    template.hasResourceProperties("AWS::Cognito::UserPool", {
      UsernameConfiguration: Match.objectLike({ CaseSensitive: false }),
    });
  });

  it("verifies email addr by sending a verification code", () => {
    template.hasResourceProperties("AWS::Cognito::UserPool", {
      AutoVerifiedAttributes: ["email"],
    });
  });

  it("has account recovery for email only", () => {
    template.hasResourceProperties("AWS::Cognito::UserPool", {
      AccountRecoverySetting: {
        RecoveryMechanisms: [{ Name: "verified_email", Priority: 1 }],
      },
    });
  });

  it("has a relaxed password policy", () => {
    template.hasResourceProperties("AWS::Cognito::UserPool", {
      Policies: {
        PasswordPolicy: {
          RequireLowercase: false,
          RequireUppercase: false,
          RequireNumbers: false,
          RequireSymbols: false,
        },
      },
    });
  });

  //
});

describe("cognito construct client app", () => {
  it("has a user pool client app", () => {
    template.hasResourceProperties("AWS::Cognito::UserPoolClient", {});
  });

  it("has one user pool client app", () => {
    template.resourceCountIs("AWS::Cognito::UserPoolClient", 1);
  });

  it("has implicit OAuth flow", () => {
    template.hasResourceProperties("AWS::Cognito::UserPoolClient", {
      AllowedOAuthFlows: ["implicit"],
    });
  });

  it("has 3 callback urls for redirecting logged-in candidates", () => {
    template.hasResourceProperties("AWS::Cognito::UserPoolClient", {
      CallbackURLs: [
        "http://localhost:6100/can",
        "https://main.d3dq4xzxmmo3wf.amplifyapp.com/can",
        "https://www.greenstem.uk/can",
      ],
    });
  });

  it("has 3 callback urls for redirecting after candidates log out", () => {
    template.hasResourceProperties("AWS::Cognito::UserPoolClient", {
      LogoutURLs: [
        "http://localhost:6100/logout.html",
        "https://main.d3dq4xzxmmo3wf.amplifyapp.com/logout.html",
        "https://www.greenstem.uk/logout.html",
      ],
    });
  });

  it("has both access and id token validity for 20 hours", () => {
    template.hasResourceProperties("AWS::Cognito::UserPoolClient", {
      AccessTokenValidity: 1200,
      IdTokenValidity: 1200,
      TokenValidityUnits: { AccessToken: "minutes", IdToken: "minutes" },
    });
  });

  it("prevents user existence errors", () => {
    template.hasResourceProperties("AWS::Cognito::UserPoolClient", {
      PreventUserExistenceErrors: "ENABLED",
    });
  });

  //
});

describe("cognito-construct user-pool-domain", () => {
  it("has a cognito domain prefix of greenstem-oak for userPoolOak", () => {
    template.hasResourceProperties("AWS::Cognito::UserPoolDomain", {
      Domain: "greenstem-oak",
      UserPoolId: {
        Ref: Match.stringLikeRegexp("CognitoOakUserPoolOak"),
      },
    });
  });
});
