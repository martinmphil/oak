import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { DatabaseOak } from "./database";
import { gateway } from "./gateway";

export class OakStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const gatewayOak = new gateway(this, "GatewayOak");

    const database = new DatabaseOak(this, "DatabaseOak");
  }
}
