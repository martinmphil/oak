import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as Oak from "../lib/oak-stack";

describe("oak stack", () => {
  const app = new cdk.App();
  const stack = new Oak.OakStack(app, "MyTestStack");
  const template = Template.fromStack(stack);

  it("synthesises a cloud-formation template", () => {
    template.templateMatches(Match.anyValue());
  });

  it("has correct number of lambdas and log groups", () => {
    template.resourceCountIs("AWS::Lambda::Function", 1);
    template.resourceCountIs("AWS::Logs::LogGroup", 1);
  });

  it("deletes all log groups on destroy", () => {
    template.allResources("AWS::Logs::LogGroup", {
      DeletionPolicy: "Delete",
    });
  });
});
