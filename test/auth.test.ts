import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as Oak from "../lib/oakstack";

const app = new cdk.App();
const stack = new Oak.OakStack(app, "OakTestStack");
const template = Template.fromStack(stack);

describe("cognito user pool", () => {
  it("DELETES on destroy command", () => {
    template.hasResource("AWS::Cognito::UserPool", {
      DeletionPolicy: "Delete",
    });
  });
  it("exists", () => {
    template.hasResource("AWS::Cognito::UserPool", {});
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

describe("cognito client app", () => {
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
        "http://localhost:5173/",
        "https://main.d3dq4xzxmmo3wf.amplifyapp.com/",
        "https://www.greenstem.uk/can/",
      ],
    });
  });
  it("has 3 callback urls for redirecting after candidates log out", () => {
    template.hasResourceProperties("AWS::Cognito::UserPoolClient", {
      LogoutURLs: [
        "http://localhost:5173/",
        "https://main.d3dq4xzxmmo3wf.amplifyapp.com/",
        "https://www.greenstem.uk/can/",
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

describe("cognito user-pool-domain", () => {
  it("has a cognito domain prefix of greenstem-oak for userPoolOak", () => {
    template.hasResourceProperties("AWS::Cognito::UserPoolDomain", {
      Domain: "greenstem-oak",
      UserPoolId: {
        Ref: Match.stringLikeRegexp("CognitoOakUserPoolOak"),
      },
    });
  });
});

describe("cognito-post-confirm.test lambda function", () => {
  it("sees database table-name", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      Role: Match.objectLike({
        "Fn::GetAtt": Match.arrayWith([
          Match.stringLikeRegexp("CognitoPostConfirmOak"),
        ]),
      }),
      Environment: Match.objectLike({
        Variables: Match.objectLike({
          DATABASE_NAME_OAK: Match.objectLike({
            Ref: Match.stringLikeRegexp("DatabaseOakTableOak"),
          }),
        }),
      }),
    });
  });
  it("creates an associated log group", () => {
    template.hasResourceProperties("AWS::Logs::LogGroup", {
      LogGroupName: {
        "Fn::Join": Match.arrayWith([
          Match.arrayWith([
            Match.objectLike({
              Ref: Match.stringLikeRegexp("^CognitoOakCognitoPostConfirmOak"),
            }),
          ]),
        ]),
      },
    });
  });
  it("can write to database", () => {
    template.hasResourceProperties("AWS::IAM::Policy", {
      Roles: Match.arrayWith([
        {
          Ref: Match.stringLikeRegexp("CognitoPostConfirmOak"),
        },
      ]),
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(["dynamodb:PutItem"]),
            Effect: "Allow",
          }),
        ]),
      },
    });
  });
  it("has permission to be invoked by cognito", () => {
    template.hasResourceProperties("AWS::Lambda::Permission", {
      Action: "lambda:InvokeFunction",
      Principal: "cognito-idp.amazonaws.com",
      FunctionName: {
        "Fn::GetAtt": Match.arrayWith([
          Match.stringLikeRegexp("^CognitoOakCognitoPostConfirmOak"),
        ]),
      },
      SourceArn: {
        "Fn::GetAtt": Match.arrayWith([
          Match.stringLikeRegexp("^CognitoOakUserPoolOak"),
        ]),
      },
    });
  });

  //
});
