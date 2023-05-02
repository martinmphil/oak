import { getAssessmentData } from "../../../lib/handlers/workbook/getAssessmentData";
import * as getItemMod from "../../../lib/handlers/getItem";

describe("getAssessmentData", () => {
  const candidateId = "can333";
  const workflowId = "wflow101";
  const getItemSpy = jest.spyOn(getItemMod, "getItem");

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("exists", () => {
    expect(getAssessmentData).toBeDefined();
  });

  it("returns a promise", () => {
    expect.assertions(1);
    getItemSpy.mockResolvedValueOnce({});
    expect(getAssessmentData(candidateId, workflowId)).resolves.not.toThrow();
  });

  it("calls getItem with the right arguments", async () => {
    expect.assertions(3);
    getItemSpy.mockResolvedValueOnce({});
    getAssessmentData(candidateId, workflowId);
    expect(getItemSpy).toBeCalled();
    expect(getItemSpy).toBeCalledTimes(1);
    expect(getItemSpy).toBeCalledWith(candidateId, workflowId);
  });

  it("throws an error if the getItem fails", async () => {
    expect.assertions(3);
    getItemSpy.mockRejectedValueOnce(new Error("getItem failed"));
    await getAssessmentData(candidateId, workflowId).catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/getItem failed/i);
      expect(err.message).toMatch(/getAssessmentData/i);
    });
  });
});
