import { listingsMarkup } from "../../../lib/handlers/listings/listingsMarkup";

import * as getWorkflowProgressMod from "../../../lib/handlers/listings/getWorkflowProgress";
import * as getWorkflowTitleMod from "../../../lib/handlers/getWorkflowTitle";

describe("listings mark up", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    expect(result).toMatch(/<h2>Upcoming<\/h2>/i);
  });

  it("can return achieved", async () => {
    expect.assertions(1);
    getWorkflowProgressSpy.mockImplementationOnce(async () => "achieved");
    const result = await listingsMarkup(candidateId, catalog);
    expect(result).toMatch(/<h2>Achieved<\/h2>/i);
  });

  it("can return ongoing", async () => {
    expect.assertions(1);
    getWorkflowProgressSpy.mockImplementationOnce(async () => "ongoing");
    const result = await listingsMarkup(candidateId, catalog);
    expect(result).toMatch(/<h2>Onging<\/h2>/i);
  });

  it("calls getWorkflowTitle for each catalog element", async () => {
    expect.assertions(1);
    await listingsMarkup(candidateId, catalog);
    expect(getWorkflowTitleSpy).toBeCalledTimes(4);
  });

  //
});
