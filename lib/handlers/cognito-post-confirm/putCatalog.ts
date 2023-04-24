import { putItem } from "../dynamoUtils";

export async function putCatalog(candidateId: string, catalog: string[]) {
  const Item = {
    pk: candidateId,
    sk: "catalog",
    entityType: "catalogData",
    catalog,
  };

  const result = await putItem(Item).catch((err) => {
    let fault = `We failed to put the standard catalog into our database for ${JSON.stringify(
      Item
    )} :- ${err}`;
    console.warn(fault);
    throw new Error(fault);
  });

  return result;
}
