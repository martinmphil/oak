import { UserPool, AccountRecovery } from "aws-cdk-lib/aws-cognito";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class CognitoOak extends Construct {
  public readonly userPool;
  public readonly userPoolClient;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const userPool = new UserPool(this, "UserPoolOak", {
      userPoolName: "canOak",
      selfSignUpEnabled: true,
      passwordPolicy: {
        requireLowercase: false,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false,
      },
      signInAliases: { email: true },
      signInCaseSensitive: false,
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const domain = userPool.addDomain("CognitoDomainOak", {
      cognitoDomain: { domainPrefix: "greenstem-oak" },
    });

    const userPoolClient = userPool.addClient("UserPoolClientOak", {
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
        callbackUrls: [
          "http://localhost:6100/can",
          "https://main.d3dq4xzxmmo3wf.amplifyapp.com/can",
          "https://www.greenstem.uk/can",
        ],
        logoutUrls: [
          "http://localhost:6100/logout.html",
          "https://main.d3dq4xzxmmo3wf.amplifyapp.com/logout.html",
          "https://www.greenstem.uk/logout.html",
        ],
      },
      preventUserExistenceErrors: true,
      accessTokenValidity: cdk.Duration.minutes(1200),
      idTokenValidity: cdk.Duration.minutes(1200),
    });

    this.userPool = userPool;
    this.userPoolClient = userPoolClient;

    const signInUrl = domain.signInUrl(userPoolClient, {
      redirectUri: "https://main.d3dq4xzxmmo3wf.amplifyapp.com/can",
    });
    new cdk.CfnOutput(this, "cognito sign-in url", {
      value: signInUrl,
      description: "cognito sign in url",
      exportName: "signInUrl",
    });

    //
  }
}
