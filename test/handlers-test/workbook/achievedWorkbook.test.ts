import { achievedWorkbook } from "../../../lib/handlers/workbook/achievedWorkbook";

describe("achievedWorkbook", () => {
  const candidateId = "candidate-dummy_username";
  const workflowId = "workflow101";

  it("exists", () => {
    expect(achievedWorkbook).toBeDefined();
  });

  it("returns a promise", () => {
    expect.assertions(1);
    expect(achievedWorkbook(candidateId, workflowId)).resolves.not.toThrow();
  });

  it("resolves to a string", async () => {
    expect.assertions(2);
    const result = await achievedWorkbook(candidateId, workflowId);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(1);
  });
});
