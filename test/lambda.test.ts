import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as Oak from "../lib/oak-stack";

const app = new cdk.App();
const stack = new Oak.OakStack(app, "OakTestStack");
const template = Template.fromStack(stack);

describe("candidate-email lambda function", () => {
  it("integrates with gateway", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Integration", {
      IntegrationUri: {
        "Fn::GetAtt": Match.arrayWith([
          Match.stringLikeRegexp("CandidateEmail"),
        ]),
      },
    });
  });

  //
});

describe("catalog lambda function", () => {
  it("integrates with gateway", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Integration", {
      IntegrationUri: {
        "Fn::GetAtt": Match.arrayWith([Match.stringLikeRegexp("Catalog")]),
      },
    });
  });
  it("sees database table-name", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      Role: Match.objectLike({
        "Fn::GetAtt": Match.arrayWith([Match.stringLikeRegexp("Catalog")]),
      }),
      Environment: Match.objectLike({
        Variables: Match.objectLike({
          DATABASE_NAME_OAK: Match.objectLike({
            Ref: Match.stringLikeRegexp(
              "GatewayOakLambdaOakDatabaseOakTableOak"
            ),
          }),
        }),
      }),
    });
  });
  it("can read database", () => {
    template.hasResourceProperties("AWS::IAM::Policy", {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(["dynamodb:GetItem"]),
            Effect: "Allow",
          }),
        ]),
      },
      Roles: Match.arrayWith([
        {
          Ref: Match.stringLikeRegexp("GatewayOakLambdaOakCatalogOak"),
        },
      ]),
    });
  });

  //
});

describe("exam lambda function", () => {
  it("integrates with gateway", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Integration", {
      IntegrationUri: {
        "Fn::GetAtt": Match.arrayWith([Match.stringLikeRegexp("Exam")]),
      },
    });
  });

  //
});
