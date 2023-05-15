import { IAnswerMark, ISubmission } from "../dynamoInterface";

export function scoreSubmission(
  submissionObj: ISubmission,
  rubricArr: IAnswerMark[]
) {
  if (submissionObj.score && submissionObj.outOf) {
    return submissionObj;
  }

  const outOf = rubricArr
    .map((el) => el.mark)
    .reduce((prev, curr) => {
      return Math.max(prev, curr);
    }, 0);

  const candidateAnswer = submissionObj.candidateAnswer;

  let score = 0;

  const markAwarded = rubricArr.find(
    (el) => el.answer === candidateAnswer
  )?.mark;

  if (markAwarded && typeof markAwarded === "number" && markAwarded > 0) {
    score = markAwarded;
  }

  return { ...submissionObj, score, outOf };
}
