import { getItem } from "../getItem";
import { ISubmission } from "../dynamoInterface";

import { scoreSubmission } from "./scoreSubmission";
import { putItem } from "../putItem";

export async function gradeAssessmentData(assessmentData: any) {
  try {
    if (
      assessmentData &&
      assessmentData.submissionsArr &&
      Array.isArray(assessmentData.submissionsArr)
    ) {
      const scoredSubmissionsArr = await Promise.all(
        assessmentData.submissionsArr.map(async (el: ISubmission) => {
          const worksheetData = await getItem(el.worksheetId, el.worksheetId);

          const rubricArr = worksheetData?.worksheetObj?.rubricArr;

          if (Array.isArray(rubricArr)) {
            return scoreSubmission(el, rubricArr);
          }

          return el;
        })
      );

      const outOfTotal = scoredSubmissionsArr
        .map((el) => el.outOf)
        .reduce((acc, val) => acc + val);

      const scoreTotal = scoredSubmissionsArr
        .map((el) => el.score)
        .reduce((acc, val) => acc + val);

      const percent = (100 * scoreTotal) / outOfTotal;

      const grade =
        percent >= 70
          ? "Distinction"
          : percent >= 60
          ? "Merit"
          : percent >= 40
          ? "Pass"
          : percent >= 20
          ? "Near Pass"
          : "Unclassified";

      const gradedAssessmentData = {
        ...assessmentData,
        submissionsArr: scoredSubmissionsArr,
        grade,
      };

      await putItem(gradedAssessmentData);

      return gradedAssessmentData;
    }
    return { ...assessmentData, grade: "Unclassified" };
  } catch (err) {
    throw new Error(
      ` markSubmissions(${JSON.stringify(assessmentData)}) failed:- ${err} `
    );
  }
}
