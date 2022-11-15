import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as Oak from "../lib/oak-stack";

describe("oak stack", () => {
  it("synthesises a cloud-formation template", () => {
    const app = new cdk.App();
    // when
    const stack = new Oak.OakStack(app, "MyTestStack");
    // then
    const template = Template.fromStack(stack);

    template.templateMatches(Match.anyValue());
  });
});
