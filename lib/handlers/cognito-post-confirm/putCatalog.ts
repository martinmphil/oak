import { putItem } from "../dynamoUtils";

export async function putCatalog(canId: string, catalog: string[]) {
  const Item = {
    pk: canId,
    sk: "catalog",
    entityType: "catalogData",
    catalog,
  };
  return putItem(Item);
}
