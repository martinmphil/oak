import { ongoingWorkbook } from "../../../lib/handlers/workbook/ongoingWorkbook";

describe("ongoingWorkbook", () => {
  const candidateId = "candidate-dummy_username";
  const workflowId = "workflow101";
  const dummySubmission = "a3";

  it("exists", () => {
    expect(ongoingWorkbook).toBeDefined();
  });

  // it("returns a promise", () => {
  //   expect.assertions(1);
  //   expect(
  //     ongoingWorkbook(candidateId, workflowId, dummySubmission)
  //   ).resolves.not.toThrow();
  // });

  // it("returns a string", async () => {
  //   expect.assertions(2);
  //   const result = await ongoingWorkbook(
  //     candidateId,
  //     workflowId,
  //     dummySubmission
  //   );
  //   expect(typeof result).toBe("string");
  //   expect(result.length).toBeGreaterThan(1);
  // });
});
