import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as Oak from "../lib/oakstack";

const app = new cdk.App();
const stack = new Oak.OakStack(app, "OakTestStack");
const template = Template.fromStack(stack);

describe("candidate-email lambda function", () => {
  it("integrates with gateway", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Integration", {
      IntegrationUri: {
        "Fn::GetAtt": Match.arrayWith([
          Match.stringLikeRegexp("CandidateEmailOak"),
        ]),
      },
    });
  });
  it("creates an associated log group", () => {
    template.hasResourceProperties("AWS::Logs::LogGroup", {
      LogGroupName: {
        "Fn::Join": Match.arrayWith([
          Match.arrayWith([
            Match.objectLike({
              Ref: Match.stringLikeRegexp("^CandidateEmailOak"),
            }),
          ]),
        ]),
      },
    });
  });

  //
});
