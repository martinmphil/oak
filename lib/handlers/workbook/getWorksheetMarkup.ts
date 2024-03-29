import { getItem } from "../getItem";
import { multichoice } from "./multichoice";

export async function getWorksheetMarkup(
  workflowId: string,
  worksheetId: string
) {
  let fault = ` getWorksheetMarkup(${workflowId}, ${worksheetId}) failed. `;

  try {
    const maybeItem = await getItem(worksheetId, worksheetId);

    if (maybeItem?.entityType === "multichoice") {
      return multichoice(workflowId, worksheetId, maybeItem.worksheetObj);
    }

    fault += ` Malformed entityType:- ${maybeItem?.entityType} `;

    throw new Error(fault);
  } catch (err) {
    throw new Error(`${fault}:- ${err} `);
  }
}
