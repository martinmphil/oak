import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as Oak from "../lib/oak-stack";

describe("gateway construct", () => {
  const app = new cdk.App();
  const stack = new Oak.OakStack(app, "apiTestStack");
  const template = Template.fromStack(stack);

  it("exists as an AWS API Gateway version2", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Api", {
      Name: "GatewayOak",
    });
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

  it("allows specified methods", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Api", {
      CorsConfiguration: {
        AllowMethods: ["GET", "PUT"],
      },
    });
  });

  it("authorizes all routes", () => {
    template.allResourcesProperties("AWS::ApiGatewayV2::Route", {
      AuthorizationType: "JWT",
    });
  });

  it("authorizes via correct user pool client", () => {
    template.hasResourceProperties("AWS::ApiGatewayV2::Authorizer", {
      JwtConfiguration: {
        Audience: [
          {
            Ref: Match.stringLikeRegexp(
              "^GatewayOakCognitoOakUserPoolOakUserPoolClientOak"
            ),
          },
        ],
      },
    });
  });

  //
});
