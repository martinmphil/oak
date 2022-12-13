import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as Oak from "../lib/oak-stack";

const app = new cdk.App();
const stack = new Oak.OakStack(app, "apiTestStack");
const template = Template.fromStack(stack);

describe("dynamoDb database", () => {
  it("exists", () => {
    template.hasResourceProperties("AWS::DynamoDB::Table", Match.anyValue());
  });

  it("DELETES on destroy command", () => {
    template.hasResource("AWS::DynamoDB::Table", {
      DeletionPolicy: "Delete",
    });
  });

  it("runs a custom resource when created to seed database", () => {
    template.hasResourceProperties("Custom::AWS", {
      Create: {
        "Fn::Join": Match.arrayWith([
          Match.arrayWith([Match.stringLikeRegexp("batchWriteItem")]),
        ]),
      },
    });
  });

  //
});
