interface IPrimary {
  pk: string;
  sk: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMultichoiceObj {
  scenario: string;
  choicesArr: string[];
  rubric: {
    answer: string;
    mark: number;
  };
}
// Potentially, in addition to multichoice, add worksheet types.
interface IWorksheetData extends IPrimary {
  entityType: "multichoice";
  worksheetObj: IMultichoiceObj;
}
// pk = sk = worksheetId eg "worksheet1"

interface IWorkflowData extends IPrimary {
  entityType: "workflowData";
  workflowTitle: string;
  workflow: string[];
}
// pk = sk = workflowId eg "workflow101"
// workflow:[worksheetId,…] eg
// workflow: ["worksheet1","worksheet2","worksheet99"]

interface ICatalogData extends IPrimary {
  entityType: "catalogData";
  catalog: string[];
}
// pk = candidateId
//   ie candidate-cognito-universally-unique-identifier
//   eg "can333-ff96d547-eae4-4c93-b896-72df92ac2052"
// sk = "catalog"
// catalog: [workflowId, …] eg
// catalog: ["workflow101", "workflow201"]

export interface IAssessmentData extends IPrimary {
  entityType: "assessmentData";
  workflow: string[];
  workflowIndex: number;
  revealDatesArr: { worksheetId: string; revealDate: string }[];
  mark: number;
  outOf: number;
  grade: "Distinction" | "Merit" | "Pass" | "Near Pass" | "Unclassified";
  submissionsArr: { wsheetId: string; candidateAnswer: string }[];
}
// pk = candidateId
// sk = workflowId eg "workflow101"
// workflowIndex: -9000,0,1,…n
// mark:5, outOf:10, grade:"Pass"
// submissionsArr: [{wsheet1: a3}, {wsheet2: a4}…]

export type TItem =
  | IPrimary
  | IWorksheetData
  | IWorkflowData
  | ICatalogData
  | IAssessmentData;

export interface IPutParams {
  TableName: string;
  Item: TItem;
  ConditionExpression?: string;
}
