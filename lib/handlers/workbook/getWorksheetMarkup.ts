import { getItem } from "../getItem";

export async function getWorksheetMarkup(worksheetId: string) {
  let fault = `We failed to get the markup for worksheet ${worksheetId}. `;

  const maybeItem = await getItem(worksheetId, worksheetId).catch((err) => {
    fault += `We failed to get Item:- ${err}`;
    throw new Error(fault);
  });

  const maybeMarkup = maybeItem?.markup;

  if (
    maybeMarkup &&
    typeof maybeMarkup === "string" &&
    maybeMarkup.length > 0
  ) {
    return maybeMarkup;
  }

  throw new Error(fault);
}
