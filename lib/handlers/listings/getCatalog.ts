import { getItem } from "../dynamoUtils";
import { validStringArray } from "../validStringArray";

export async function getCatalog(candidateId: string) {
  try {
    const data = await getItem(candidateId, "catalog");

    const catalog = validStringArray(data?.catalog);

    return catalog;
  } catch (err) {
    throw new Error(`We failed to get the catalog for ${candidateId}:- ${err}`);
  }
}
