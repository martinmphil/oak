import { scoreSubmission } from "../../../lib/handlers/workbook/scoreSubmission";

const completedSubmissionObj = {
  worksheetId: "worksheet1",
  candidateAnswer: "a1",
  score: 1,
  outOf: 3,
};

const dummySubmissionObj = {
  worksheetId: "worksheet1",
  candidateAnswer: "a1",
};

const dummyrubricArr = [
  { answer: "a1", mark: 1 },
  { answer: "a2", mark: 2 },
  { answer: "a3", mark: 3 },
];

describe("scoreAnswer", () => {
  it("should exist", () => {
    expect(scoreSubmission).toBeDefined();
    expect(typeof scoreSubmission).toBe("function");
  });

  it("returns arg with completedSubmissionObj", () => {
    const result = scoreSubmission(completedSubmissionObj, dummyrubricArr);
    expect(result).toEqual(completedSubmissionObj);
  });

  it("returns submission with score and outOf", () => {
    expect(
      scoreSubmission(
        {
          worksheetId: "worksheet1",
          candidateAnswer: "a1",
        },
        [
          { answer: "a1", mark: 1 },
          { answer: "a2", mark: 2 },
          { answer: "a3", mark: 3 },
        ]
      )
    ).toEqual({
      worksheetId: "worksheet1",
      candidateAnswer: "a1",
      score: 1,
      outOf: 3,
    });

    expect(
      scoreSubmission(
        {
          worksheetId: "worksheet1",
          candidateAnswer: "a2",
        },
        [
          { answer: "a1", mark: 1 },
          { answer: "a2", mark: 2 },
        ]
      )
    ).toEqual({
      worksheetId: "worksheet1",
      candidateAnswer: "a2",
      score: 2,
      outOf: 2,
    });
  });

  //
});
