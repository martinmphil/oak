import { getItem } from "../getItem";
import { validStringArray } from "../validStringArray";

export async function getStandardCatalog() {
  const data = await getItem("standardCatalog", "standardCatalog").catch(
    (err) => {
      const fault = `We failed to get the standard catalog:- ${err} `;
      console.warn(fault);
      throw new Error(fault);
    }
  );

  const standardCatalog = validStringArray(data?.catalog);

  return standardCatalog;
}
