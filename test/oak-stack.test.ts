import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as Oak from "../lib/oak-stack";

describe("oak stack", () => {
  const app = new cdk.App();
  const stack = new Oak.OakStack(app, "MyTestStack");
  const template = Template.fromStack(stack);

  it("reproduces snapshot", () => {
    expect(template.toJSON()).toMatchSnapshot();
  });

  it("synthesises a cloud-formation template", () => {
    template.templateMatches(Match.anyValue());
  });
});
