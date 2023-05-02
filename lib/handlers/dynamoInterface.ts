interface IPrimary {
  pk: string;
  sk: string;
}
// pk is partition key
// sk is sort key

interface IWorksheetData extends IPrimary {
  entityType: "intro" | "4Multichoice" | "outro";
  createdAt?: string;
  updatedAt?: string;
  markup: string;
  rubric: { [key: string]: number };
}
// pk = sk = worksheetId eg "worksheet1"
// {entityType:"intro", markup:"<p>Please…", rubric:{intro:0}}
// {entityType:"4Multichoice", markup:"<p>A,B,C or D?", rubric:{a4:1}}
// {entityType:"outro", markup:"<p>Thanks…", rubric:{outro:0}}

interface IWorkflowData extends IPrimary {
  entityType: "workflowData";
  createdAt?: string;
  updatedAt?: string;
  workflowTitle: string;
  workflow: string[];
}
// pk = sk = workflowId eg "workflow101"
// workflow:[worksheetId,…] eg
// workflow: ["worksheet1","worksheet2","worksheet99"]

interface ICatalogData extends IPrimary {
  entityType: "catalogData";
  createdAt?: string;
  updatedAt?: string;
  catalog: string[];
}
// pk = candidateId
//   ie candidate-cognito-universally-unique-identifier
//   eg "can333-ff96d547-eae4-4c93-b896-72df92ac2052"
// sk = "catalog"
// catalog: [workflowId, …] eg
// catalog: ["workflow101", "workflow201"]

interface IAssessmentData extends IPrimary {
  entityType: "assessmentData";
  createdAt?: string;
  updatedAt?: string;
  workflowIndex: number;
  workflow: string[];
  mark: number;
  outOf: number;
  grade: "Distinction" | "Merit" | "Pass" | "Near Pass" | "Unclassified";
  submissionsArr: { [key: string]: number }[];
}
// pk = candidateId
// sk = workflowId eg "workflow101"
// workflowIndex: -9000,0,1,…n
// mark:5, outOf:10, grade:"Pass"
// submissionsArr: [{wsheet1: a3}, {wsheet2: a4}…]

export type IItem =
  | IPrimary
  | IWorksheetData
  | IWorkflowData
  | ICatalogData
  | IAssessmentData;

export interface IPutParams {
  TableName: string;
  Item: IItem;
  ConditionExpression?: string;
}
