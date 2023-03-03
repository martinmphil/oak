import { getItem } from "../dynamoUtils";

export async function getStandardCatalog(): Promise<string[]> {
  const defaultReturn = [""];
  const data = await getItem("standardCatalog", "standardCatalog");
  const standardCatalog = data?.catalog;

  if (standardCatalog === undefined || standardCatalog === null) {
    console.warn(` Database failed to supply catalog. `);
    return defaultReturn;
  }
  if (Array.isArray(standardCatalog) === false) {
    console.warn(` Database failed to supply standard catalog as an array. `);
    return defaultReturn;
  }
  if (standardCatalog.length < 1) {
    console.warn(` Database supplied standard catalog as an empty array. `);
    return defaultReturn;
  }

  if (
    Array.isArray(standardCatalog) === true &&
    standardCatalog.every((el: any) => typeof el === "string" && el.length > 0)
  ) {
    return standardCatalog;
  }

  return defaultReturn;
}
