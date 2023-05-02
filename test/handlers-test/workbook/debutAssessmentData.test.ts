import { debutAssessmentData } from "../../../lib/handlers/workbook/debutAssessmentData";

import * as putItemMod from "../../../lib/handlers/putItem";

describe("debutAssessmentData", () => {
  const candidateId = "can333";
  const workflowId = "wflow101";
  const workflow = ["wsheet001", "wsheet002"];

  it("exists", () => {
    expect(debutAssessmentData).toBeDefined();
  });

  it("returns a promise", () => {
    expect.assertions(1);
    const putItemSpy = jest.spyOn(putItemMod, "putItem");
    putItemSpy.mockResolvedValueOnce("dummy_put_item_response" as any);
    expect(
      debutAssessmentData(candidateId, workflowId, workflow)
    ).resolves.not.toThrow();
  });

  it("calls putItem with the correct params", async () => {
    expect.assertions(2);
    const putItemSpy = jest.spyOn(putItemMod, "putItem");
    putItemSpy.mockResolvedValueOnce("dummy_put_item_response" as any);
    await debutAssessmentData(candidateId, workflowId, workflow).then((x) => {
      expect(x).toBe("dummy_put_item_response");
    });
    expect(putItemSpy).toHaveBeenCalledWith({
      createdAt: expect.stringMatching(/T.*:.*:.*Z/i),
      entityType: "assessmentData",
      pk: "can333",
      sk: "wflow101",
      workflow,
      workflowIndex: 0,
    });
  });

  it("throws an error if the putItem call fails", async () => {
    expect.assertions(3);
    const putItemSpy = jest.spyOn(putItemMod, "putItem");
    putItemSpy.mockRejectedValueOnce("dummy_put_item_error" as any);
    await debutAssessmentData(candidateId, workflowId, workflow).catch(
      (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toMatch(/dummy_put_item_error/i);
        expect(err.message).toMatch(/debutAssessmentData/i);
      }
    );
  });

  //
});
