import * as path from "path";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { UserPool, AccountRecovery } from "aws-cdk-lib/aws-cognito";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { lambdaCommonProps } from "./fixtures/lambdaCommonProps";

export interface ICognitoOakProps {
  tableNameOak: string;
}

export class CognitoOak extends Construct {
  public readonly userPool;
  public readonly userPoolClient;
  public readonly cognitoPostConfirm;

  constructor(scope: Construct, id: string, props: ICognitoOakProps) {
    super(scope, id);

    const cognitoPostConfirm = new NodejsFunction(
      this,
      "CognitoPostConfirmOak",
      {
        ...lambdaCommonProps,
        entry: path.join(__dirname, `/handlers/cognito-post-confirm/index.ts`),
        environment: {
          DATABASE_NAME_OAK: props.tableNameOak,
        },
      }
    );
    new LogGroup(this, "LogGroupCognitoPostConfirmOak", {
      logGroupName: `/aws/lambda/${cognitoPostConfirm.functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    this.cognitoPostConfirm = cognitoPostConfirm;

    const userPool = new UserPool(this, "UserPoolOak", {
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
      lambdaTriggers: { postConfirmation: cognitoPostConfirm },
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
    new cdk.CfnOutput(this, "CognitoSignInUrl", {
      value: signInUrl,
      description: "cognito sign in url",
      exportName: "signInUrl",
    });

    //
  }
}
