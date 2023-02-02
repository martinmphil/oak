import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Gateway } from "./gateway";

export class OakStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const gatewayOak = new Gateway(this, "GatewayOak");
  }
}
