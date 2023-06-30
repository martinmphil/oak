import { IMultichoiceObj } from "../dynamoInterface";
import { validStringArray } from "../validStringArray";

export function multichoice(
  workflowId: string,
  worksheetId: string,
  obj: IMultichoiceObj
) {
  let fault = ` multichoice(${JSON.stringify(obj)}) failed. `;

  function choicesMarkup(workflowId: string, choicesArr: string[]) {
    const buttonsMarkup = choicesArr.map((choice, index) => {
      const result = `<p><button type="button" data-candidate-answer="a${
        index + 1
      }" data-workflow-id="${workflowId}" data-worksheet-id="${worksheetId}">${choice}</button></p>`;
      return result;
    });
    return `<div class=choices>${buttonsMarkup.join(" ")}</div>`;
  }

  try {
    if (
      obj === undefined ||
      obj === null ||
      typeof obj.scenario != "string" ||
      obj.scenario.length === 0 ||
      !Array.isArray(obj.choicesArr)
    ) {
      fault += ` Malformed multichoiceObj. `;
      throw new Error(fault);
    }

    const choicesArr = validStringArray(obj.choicesArr);

    return "<hr>" + obj.scenario + choicesMarkup(workflowId, choicesArr);
  } catch (err) {
    throw new Error(` ${fault}:- ${err} `);
  }
}
