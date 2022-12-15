import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as Oak from "../lib/oak-stack";

describe("oak lambda functions", () => {
  const app = new cdk.App();
  const stack = new Oak.OakStack(app, "testLambdaStack");
  const template = Template.fromStack(stack);

  it("has correct number of lambdas and log groups", () => {
    template.resourceCountIs("AWS::Lambda::Function", 4);
    template.resourceCountIs("AWS::Logs::LogGroup", 3);
  });

  it("deletes all log groups on destroy", () => {
    template.allResources("AWS::Logs::LogGroup", {
      DeletionPolicy: "Delete",
    });
  });

  it("integrates candidate-email function", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Integration", {
      IntegrationUri: {
        "Fn::GetAtt": Match.arrayWith([
          Match.stringLikeRegexp("candidateEmail"),
        ]),
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
