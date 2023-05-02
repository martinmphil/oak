import { handler } from "../../../lib/handlers/workbook/index";

import { dummyDebutEvent } from "./dummyDebutEvent";
import * as getAssessmentDataMod from "../../../lib/handlers/workbook/getAssessmentData";
import * as achievedWorkbookMod from "../../../lib/handlers/workbook/achievedWorkbook";
import * as ongoingWorkbookMod from "../../../lib/handlers/workbook/ongoingWorkbook";
import * as debutWorkbookMod from "../../../lib/handlers/workbook/debutWorkbook";

describe("index workbook lambda function", () => {
  const candidateId = "candidate-dummy_username";
  const workflowId = "workflow101";

  const getAssessmentDataSpy = jest.spyOn(
    getAssessmentDataMod,
    "getAssessmentData"
  );
  beforeEach(() => {
    console.warn = jest.fn();
    getAssessmentDataSpy.mockResolvedValue({});
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("exists", () => {
    expect(handler).toBeDefined();
  });

  it("returns default html and warns if event username is empty", async () => {
    const badDebutEvent = JSON.parse(JSON.stringify(dummyDebutEvent));
    badDebutEvent.requestContext.authorizer.jwt.claims.username = "";
    // @ts-ignore
    await handler(badDebutEvent).then((response) => {
      expect(response?.body).toMatch(/refresh this page.*try again later/i);
      expect(response?.body).toMatch(
        /tell your administrator an error occurred.*:.*:/i
      );
    });
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/index-workbook.*failed/i)
    );
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/missing username/i)
    );
  });

  it("returns default html and warns if event workflowId is empty", async () => {
    const badDebutEvent = JSON.parse(JSON.stringify(dummyDebutEvent));
    badDebutEvent.pathParameters.workflowId = "";
    // @ts-ignore
    await handler(badDebutEvent).then((response) => {
      expect(response?.body).toMatch(/refresh this page.*try again later/i);
      expect(response?.body).toMatch(
        /tell your administrator an error occurred.*:.*:/i
      );
    });
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/index-workbook.*failed/i)
    );
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/missing workflowId/i)
    );
  });

  it("calls getAssessmentData with correct params", async () => {
    expect.assertions(2);
    // @ts-ignore
    await handler(dummyDebutEvent).then((response) => {
      expect(getAssessmentDataSpy).toHaveBeenCalled();
      expect(getAssessmentDataSpy).toBeCalledWith(candidateId, workflowId);
    });
  });

  //
});

describe("index workbook lambda with NO assessment data", () => {
  const candidateId = "candidate-dummy_username";
  const workflowId = "workflow101";
  const dummyHtml = `<div>dummy</div>`;
  const getAssessmentDataSpy = jest.spyOn(
    getAssessmentDataMod,
    "getAssessmentData"
  );
  const debutWorkbookSpy = jest.spyOn(debutWorkbookMod, "debutWorkbook");
  beforeEach(() => {
    console.warn = jest.fn();
    getAssessmentDataSpy.mockResolvedValue({});
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("warns and returns default html if debutWorkbook errors", async () => {
    expect.assertions(5);
    debutWorkbookSpy.mockRejectedValueOnce(
      new Error("debut-workbook failed. ")
    );
    // @ts-ignore
    await handler(dummyDebutEvent).then((response) => {
      expect(response?.body).toMatch(/refresh this page.*try again later/i);
      expect(response?.body).toMatch(
        /tell your administrator an error occurred.*:.*:/i
      );
    });
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/index-workbook.*failed/i)
    );
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/debut-workbook failed/i)
    );
  });

  it("calls debutWorkbook with correct params and returns dummyHtml", async () => {
    expect.assertions(3);
    debutWorkbookSpy.mockResolvedValueOnce(dummyHtml);
    // @ts-ignore
    await handler(dummyDebutEvent).then((response) => {
      expect(response?.body).toBe(dummyHtml);
    });
    expect(debutWorkbookSpy).toHaveBeenCalled();
    expect(debutWorkbookSpy).toBeCalledWith(candidateId, workflowId);
  });

  //
});

//
//
describe("index workbook lambda with negative assessment data", () => {
  const candidateId = "candidate-dummy_username";
  const workflowId = "workflow101";
  const dummyHtml = `<div>dummy</div>`;
  const getAssessmentDataSpy = jest.spyOn(
    getAssessmentDataMod,
    "getAssessmentData"
  );
  const achievedWorkbookSpy = jest.spyOn(
    achievedWorkbookMod,
    "achievedWorkbook"
  );
  beforeEach(() => {
    console.warn = jest.fn();
    getAssessmentDataSpy.mockResolvedValue({ workflowIndex: -1 });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("warns and returns default html if achievedWorkbook errors", async () => {
    expect.assertions(5);
    achievedWorkbookSpy.mockRejectedValueOnce(
      new Error("achievedWorkbook failed. ")
    );
    // @ts-ignore
    await handler(dummyDebutEvent).then((response) => {
      expect(response?.body).toMatch(/refresh this page.*try again later/i);
      expect(response?.body).toMatch(
        /tell your administrator an error occurred.*:.*:/i
      );
    });
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/index-workbook.*failed/i)
    );
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/achievedWorkbook failed/i)
    );
  });

  it("calls achievedWorkbook with correct params and returns dummyHtml", async () => {
    expect.assertions(3);
    achievedWorkbookSpy.mockResolvedValueOnce(dummyHtml);
    // @ts-ignore
    await handler(dummyDebutEvent).then((response) => {
      expect(response?.body).toBe(dummyHtml);
    });
    expect(achievedWorkbookSpy).toHaveBeenCalled();
    expect(achievedWorkbookSpy).toBeCalledWith(candidateId, workflowId);
  });

  //
});

//
//
describe("index workbook lambda with positive assessment data", () => {
  const candidateId = "candidate-dummy_username";
  const workflowId = "workflow101";
  const dummySubmission = "a3";
  const dummyHtml = `<div>dummy</div>`;
  const getAssessmentDataSpy = jest.spyOn(
    getAssessmentDataMod,
    "getAssessmentData"
  );
  const ongoingWorkbookSpy = jest.spyOn(ongoingWorkbookMod, "ongoingWorkbook");
  beforeEach(() => {
    console.warn = jest.fn();
    getAssessmentDataSpy.mockResolvedValue({ workflowIndex: 3 });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("warns and returns default html if ongoingWorkbookSpy errors", async () => {
    expect.assertions(5);
    ongoingWorkbookSpy.mockRejectedValueOnce(
      new Error("ongoingWorkbook failed. ")
    );
    // @ts-ignore
    await handler(dummyDebutEvent).then((response) => {
      expect(response?.body).toMatch(/refresh this page.*try again later/i);
      expect(response?.body).toMatch(
        /tell your administrator an error occurred.*:.*:/i
      );
    });
    expect(console.warn).toHaveBeenCalled();
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/index-workbook.*failed/i)
    );
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/ongoingWorkbook failed/i)
    );
  });

  // it("calls ongoingWorkbook with correct params and returns dummyHtml", async () => {
  //   expect.assertions(3);
  //   ongoingWorkbookSpy.mockResolvedValueOnce(dummyHtml);
  //   // @ts-ignore
  //   await handler(dummyDebutEvent).then((response) => {
  //     expect(response?.body).toBe(dummyHtml);
  //   });
  //   expect(ongoingWorkbookSpy).toHaveBeenCalled();
  //   expect(ongoingWorkbookSpy).toBeCalledWith(
  //     candidateId,
  //     workflowId,
  //     dummySubmission
  //   );
  // });

  //
});
