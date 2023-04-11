import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import { handler } from "../../../lib/handlers/catalog/index";
import { dummyEvent } from "../dummyEvent";

import * as getCatalogModule from "../../../lib/handlers/catalog/getCatalog";
import * as getWorkflowProgressModule from "../../../lib/handlers/catalog/getWorkflowProgress";

describe("index catalog lambda function", () => {
  const candidateId = "candidate-dummy_username";

  const originalEnv = process.env;
  const dynamoMock = mockClient(DynamoDBDocumentClient);
  beforeEach(() => {
    process.env.DATABASE_NAME_OAK = "dummy_table_name";
    jest.resetModules();
    dynamoMock.reset();
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "catalog" },
      })
      .resolves({
        Item: { catalog: ["wflow1", "wflow2", "wflow3", "wflow4"] },
      });

    dynamoMock
      .on(GetCommand, {
        Key: { pk: "wflow1", sk: "wflow1" },
      })
      .resolves({
        Item: { workflowTitle: "title1" },
      });
    dynamoMock
      .on(GetCommand, {
        Key: { pk: "wflow2", sk: "wflow2" },
      })
      .resolves({
        Item: { workflowTitle: "title2" },
      });
    dynamoMock
      .on(GetCommand, {
        Key: { pk: "wflow3", sk: "wflow3" },
      })
      .resolves({
        Item: { workflowTitle: "title3" },
      });
    dynamoMock
      .on(GetCommand, {
        Key: { pk: "wflow4", sk: "wflow4" },
      })
      .resolves({
        Item: { workflowTitle: "title4" },
      });

    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow1" },
      })
      .resolves({
        Item: { workProgress: 0 },
      });
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow2" },
      })
      .resolves({
        Item: { workProgress: 3 },
      });
    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow3" },
      })
      .resolves({
        Item: { workProgress: -1 },
      });

    dynamoMock
      .on(GetCommand, {
        Key: { pk: candidateId, sk: "wflow4" },
      })
      .resolves({});

    // dynamoMock
    //   .on(GetCommand, {
    //     Key: { pk: candidateId, sk: "wflow4" },
    //   })
    //   .rejects();
  });
  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
    dynamoMock.reset();
  });

  it("exists", () => {
    expect(handler).toBeDefined();
  });

  it("returns a promise", async () => {
    expect.assertions(1);
    // @ts-ignore
    await expect(handler(dummyEvent)).resolves.not.toThrow();
  });

  it("handles catalog with empty string", () => {
    expect.assertions(1);
    const getCatalogSpy = jest.spyOn(getCatalogModule, "getCatalog");
    getCatalogSpy.mockImplementationOnce(async () => {
      return [""];
    });
    // @ts-ignore
    handler(dummyEvent).then((response) => {
      expect(response?.body).toMatch(/please contact your Administrator/i);
    });
    getCatalogSpy.mockRestore();
  });

  it("returns ongoing article", () => {
    expect.assertions(1);
    // @ts-ignore
    handler(dummyEvent).then((response) => {
      expect(response?.body).toMatch(
        /<article.*<h1>Onging<\/h1><button.*>title2<\/button><\/article><hr \/>/i
      );
    });
  });

  it("returns upcoming article", () => {
    expect.assertions(1);
    // @ts-ignore
    handler(dummyEvent).then((response) => {
      expect(response?.body).toMatch(
        /<article.*<h1>Upcoming<\/h1><button.*>title1<\/button>/i
      );
    });
  });

  it("returns achieved article", () => {
    expect.assertions(1);
    // @ts-ignore
    handler(dummyEvent).then((response) => {
      expect(response?.body).toMatch(
        /<article.*<h1>Achieved<\/h1><button.*>title3<\/button><\/article><hr \/>/i
      );
    });
  });

  it("handles workflows without any candidate record", () => {
    expect.assertions(1);
    // @ts-ignore
    handler(dummyEvent).then((response) => {
      expect(response?.body).toMatch(
        /<article.*<h1>Upcoming<\/h1>.*<button.*>title4<\/button><\/article><hr \/>/i
      );
    });
  });

  //
});
