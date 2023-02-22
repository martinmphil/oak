import { getItem } from "../dynamoUtils";

export async function getStandardCatalog() {
  const data = await getItem("standardCatalog", "standardCatalog");
  if (data.catalog === undefined || data.catalog === null) {
    console.warn(` Database failed to supply catalog. `);
    return [];
  }
  if (Array.isArray(data.catalog) === false) {
    console.warn(` Database failed to supply standard catalog array. `);
    return [];
  }
  const standardCatalog = Array.isArray(data.catalog) ? data.catalog : [];
  return standardCatalog;
}
