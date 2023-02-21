import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as Oak from "../lib/oakstack";

const app = new cdk.App();
const stack = new Oak.OakStack(app, "OakTestStack");
const template = Template.fromStack(stack);

describe("workbook lambda function", () => {
  it("integrates with gateway", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Integration", {
      IntegrationUri: {
        "Fn::GetAtt": Match.arrayWith([Match.stringLikeRegexp("Workbook")]),
      },
    });
  });
  it("creates an associated log group", () => {
    template.hasResourceProperties("AWS::Logs::LogGroup", {
      LogGroupName: {
        "Fn::Join": Match.arrayWith([
          Match.arrayWith([
            Match.objectLike({
              Ref: Match.stringLikeRegexp("^WorkbookOak"),
            }),
          ]),
        ]),
      },
    });
  });
  it("sees database table-name", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      Role: Match.objectLike({
        "Fn::GetAtt": Match.arrayWith([Match.stringLikeRegexp("WorkbookOak")]),
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
  it("can write to database", () => {
    template.hasResourceProperties("AWS::IAM::Policy", {
      Roles: Match.arrayWith([
        {
          Ref: Match.stringLikeRegexp("WorkbookOak"),
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

  //
});
