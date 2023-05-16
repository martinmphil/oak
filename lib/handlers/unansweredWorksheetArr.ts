import { ISubmission } from "./dynamoInterface";

export function unansweredWorksheetArr(
  workflow: string[],
  submissionsArr: ISubmission[]
) {
  if (
    Boolean(workflow) === false ||
    Boolean(submissionsArr) === false ||
    Array.isArray(submissionsArr) === false
  ) {
    return workflow;
  }

  const answeredArr = submissionsArr.map((el) => el.worksheetId);
  const setA = new Set(workflow);
  const setB = new Set(answeredArr);

  return [...setA].filter((element) => !setB.has(element));
}
