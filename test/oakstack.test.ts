import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as Oak from "../lib/oakstack";

describe("oak stack", () => {
  const app = new cdk.App();
  const stack = new Oak.OakStack(app, "OakTestStack");
  const template = Template.fromStack(stack);

  // it("reproduces snapshot", () => {
  //   expect(template.toJSON()).toMatchSnapshot();
  // });

  it("synthesises a cloud-formation template", () => {
    template.templateMatches(Match.anyValue());
  });

  it("has correct number of lambda and log groups", () => {
    template.resourceCountIs("AWS::Lambda::Function", 6);
    template.resourceCountIs("AWS::Logs::LogGroup", 4);
  });

  it("deletes all log groups on destroy", () => {
    template.allResources("AWS::Logs::LogGroup", {
      DeletionPolicy: "Delete",
    });
  });

  //
});
