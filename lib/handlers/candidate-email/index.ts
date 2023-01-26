// from @types
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  // console.log("event 👉", event);
  return {
    body: "You successfully invoked lambda candidate-email function from oak stack. ",
  };
}