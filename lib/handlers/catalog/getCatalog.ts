import { getItem } from "../dynamoUtils";
import { validCatalog } from "../validCatalog";

export async function getCatalog(candidateId: string): Promise<string[]> {
  const data = await getItem(candidateId, "catalog");

  const catalog = data?.catalog;

  if (validCatalog(catalog)) {
    return catalog;
  }

  return [""];
}
