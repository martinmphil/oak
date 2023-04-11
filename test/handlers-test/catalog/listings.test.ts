import { listings } from "../../../lib/handlers/catalog/listings";

describe("listings mark up", () => {
  const dummyCandidateId = "candidate-dummy_username";

  const dummyCatalog = ["wflow1", "wflow2", "wflow3", "wflow4"];

  it("exists", () => {
    expect(listings(dummyCandidateId, dummyCatalog)).toBeDefined();
  });

  it("returns a promise", () => {
    expect(listings(dummyCandidateId, dummyCatalog)).toBeInstanceOf(Promise);
  });

  //
});
