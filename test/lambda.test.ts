import * as cdk from "aws-cdk-lib";
import { Template, Match, Capture } from "aws-cdk-lib/assertions";
import * as Oak from "../lib/oak-stack";

describe("oak lambda functions", () => {
  const app = new cdk.App();
  const stack = new Oak.OakStack(app, "testLambdaStack");
  const template = Template.fromStack(stack);

  it("has a lambda function", () => {
    template.hasResourceProperties("AWS::Lambda::Function", Match.anyValue());
  });

  it("integrates can-email-addr function", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Integration", {
      IntegrationUri: {
        "Fn::GetAtt": Match.arrayWith([Match.stringLikeRegexp("canEmailAddr")]),
      },
    });
  });

  it("integrates catalog function", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Integration", {
      IntegrationUri: {
        "Fn::GetAtt": Match.arrayWith([Match.stringLikeRegexp("catalog")]),
      },
    });
  });

  it("integrates exam function", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Integration", {
      IntegrationUri: {
        "Fn::GetAtt": Match.arrayWith([Match.stringLikeRegexp("exam")]),
      },
    });
  });

  //
});
