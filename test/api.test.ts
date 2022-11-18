import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as Oak from "../lib/oak-stack";

describe("api stack", () => {
  const app = new cdk.App();
  const stack = new Oak.OakStack(app, "apiTestStack");
  const template = Template.fromStack(stack);

  it("exists as an Api-Gateway-V2", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Api", Match.anyValue());
  });

  it("allows authorization headers", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Api", {
      CorsConfiguration: {
        AllowHeaders: ["Authorization"],
      },
    });
  });

  it("allows specified origins", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Api", {
      CorsConfiguration: {
        AllowOrigins: [
          "https://main.d3dq4xzxmmo3wf.amplifyapp.com/",
          "http://localhost:6100",
        ],
      },
    });
  });

  it("allows specified origins", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Api", {
      CorsConfiguration: {
        AllowMethods: ["GET"],
      },
    });
  });

  //
});
