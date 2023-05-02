import { submitting } from "../../../lib/handlers/workbook/submitting";

import * as putItemMod from "../../../lib/handlers/putItem";

describe("submitting", () => {
  const candidateId = "can333";
  const workflowId = "wflow101";
  const worksheetId = "wsheet001";
  it("exists", () => {
    expect(submitting).toBeDefined();
  });

  // it("returns a promise", () => {
  //   expect.assertions(1);
  //   const putItemSpy = jest.spyOn(putItemMod, "putItem");
  //   putItemSpy.mockResolvedValueOnce("dummy_put_item_response" as any);
  //   expect(
  //     submitting()
  //   ).resolves.not.toThrow();
  // });

  // it("calls putItem with the correct params", async () => {
  //   expect.assertions(2);
  //   const putItemSpy = jest.spyOn(putItemMod, "putItem");
  //   putItemSpy.mockResolvedValueOnce("dummy_put_item_response" as any);
  //   await submitting().then((x) => {
  //     expect(x).toBe("dummy_put_item_response");
  //   });
  //   expect(putItemSpy).toHaveBeenCalledWith(
  //     {
  //       createdAt: expect.stringMatching(/T.*:.*:.*Z/i),
  //       entityType: "submissionData",
  //       pk: "can333",
  //       sk: "wflow101_wsheet001",
  //     },
  //     "attribute_not_exists(pk)"
  //   );
  // });

  // it("throws an error if the putItem call fails", async () => {
  //   expect.assertions(3);
  //   const putItemSpy = jest.spyOn(putItemMod, "putItem");
  //   putItemSpy.mockRejectedValueOnce("dummy_put_item_error" as any);
  //   await submitting().catch((err) => {
  //     expect(err).toBeInstanceOf(Error);
  //     expect(err.message).toMatch(/dummy_put_item_error/i);
  //     expect(err.message).toMatch(/submitting/i);
  //   });
  // });

  //
});
