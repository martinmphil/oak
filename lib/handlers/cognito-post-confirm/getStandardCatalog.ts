import { getItem } from "../dynamoUtils";
import { validCatalog } from "../validCatalog";

export async function getStandardCatalog(): Promise<string[]> {
  const data = await getItem("standardCatalog", "standardCatalog");
  const standardCatalog = data?.catalog;

  if (validCatalog(standardCatalog)) {
    return standardCatalog;
  }

  return [""];
}
