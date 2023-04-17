import { listingsMarkup } from "../../../lib/handlers/listings/listingsMarkup";

describe("listings mark up", () => {
  const dummyCandidateId = "candidate-dummy_username";

  const dummyCatalog = ["wflow1", "wflow2", "wflow3", "wflow4"];

  it("exists", () => {
    expect(listingsMarkup(dummyCandidateId, dummyCatalog)).toBeDefined();
  });

  it("returns a promise", () => {
    expect(listingsMarkup(dummyCandidateId, dummyCatalog)).toBeInstanceOf(
      Promise
    );
  });

  //
});
