import { listingsMarkup } from "../../../lib/handlers/listings/listingsMarkup";

import * as getWorkflowProgressMod from "../../../lib/handlers/listings/getWorkflowProgress";
import * as getWorkflowTitleMod from "../../../lib/handlers/listings/getWorkflowTitle";

describe("listings mark up", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  const candidateId = "candidate-dummy_username";
  const catalog = ["wflow1", "wflow2", "wflow3", "wflow4"];

  const getWorkflowProgressSpy = jest
    .spyOn(getWorkflowProgressMod, "getWorkflowProgress")
    .mockImplementation(async () => "upcoming");

  const getWorkflowTitleSpy = jest
    .spyOn(getWorkflowTitleMod, "getWorkflowTitle")
    .mockImplementation(async () => "dummy_title");

  it("exists", () => {
    expect.assertions(1);
    expect(listingsMarkup).toBeDefined();
  });

  it("returns article mark up", async () => {
    expect.assertions(1);
    const result = await listingsMarkup(candidateId, catalog);
    expect(result).toMatch(/<article.*<\/article>/i);
  });

  it("returns button mark up", async () => {
    expect.assertions(1);
    const result = await listingsMarkup(candidateId, catalog);
    expect(result).toMatch(
      /<button type=\"button\" data-workflow-id=\"wflow4\">dummy_title<\/button>/i
    );
  });

  it("returns upcoming", async () => {
    expect.assertions(1);
    const result = await listingsMarkup(candidateId, catalog);
    expect(result).toMatch(/<h1>Upcoming<\/h1>/i);
  });

  it("can return achieved", async () => {
    expect.assertions(1);
    getWorkflowProgressSpy.mockImplementationOnce(async () => "achieved");
    const result = await listingsMarkup(candidateId, catalog);
    expect(result).toMatch(/<h1>Achieved<\/h1>/i);
  });

  it("can return ongoing", async () => {
    expect.assertions(1);
    getWorkflowProgressSpy.mockImplementationOnce(async () => "ongoing");
    const result = await listingsMarkup(candidateId, catalog);
    expect(result).toMatch(/<h1>Onging<\/h1>/i);
  });

  //
});
