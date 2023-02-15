import { Runtime, Architecture } from "aws-cdk-lib/aws-lambda";

export const lambdaCommonProps = {
  bundling: {
    externalModules: ["@aws-sdk/client-dynamodb", "@aws-sdk/lib-dynamodb"],
  },
  runtime: Runtime.NODEJS_18_X,
  architecture: Architecture.ARM_64,
};
