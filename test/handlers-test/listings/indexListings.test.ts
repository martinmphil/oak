import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import { handler } from "../../../lib/handlers/listings/index";
import { dummyEvent } from "./dummyEvent";

import * as getCatalogMod from "../../../lib/handlers/listings/getCatalog";
import * as listingsMarkupMod from "../../../lib/handlers/listings/listingsMarkup";

describe("index listings lambda function", () => {
  const candidateId = "candidate-dummy_username";

  const getCatalogSpy = jest.spyOn(getCatalogMod, "getCatalog");
  const listingsMarkupSpy = jest.spyOn(listingsMarkupMod, "listingsMarkup");

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("can give default html", async () => {
    expect.assertions(2);
    getCatalogSpy.mockResolvedValueOnce([]);
    listingsMarkupSpy.mockResolvedValueOnce("");
    // @ts-ignore
    const result = await handler(dummyEvent);
    expect(typeof result?.body === "string").toBe(true);
    expect(result?.body).toMatch(
      /tell your administrator an error occurred.*:.*:/i
    );
  });

  it("calls getCatalog", async () => {
    expect.assertions(3);
    getCatalogSpy.mockResolvedValueOnce(["worksheet1"]);
    listingsMarkupSpy.mockResolvedValueOnce("dummy_html1");
    // @ts-ignore
    const result = await handler(dummyEvent);
    expect(result.body).toBe("dummy_html1");
    expect(getCatalogSpy).toBeCalled();
    expect(getCatalogSpy).toBeCalledWith(candidateId);
  });

  it("calls listingsMarkup", async () => {
    expect.assertions(3);
    getCatalogSpy.mockResolvedValueOnce(["worksheet1"]);
    listingsMarkupSpy.mockResolvedValueOnce("dummy_html2");
    // @ts-ignore
    const result = await handler(dummyEvent);
    expect(result.body).toBe("dummy_html2");
    expect(listingsMarkupSpy).toBeCalled();
    expect(listingsMarkupSpy).toBeCalledWith(candidateId, ["worksheet1"]);
  });

  it("warns and gives default markup if getCatalog fails", async () => {
    expect.assertions(4);
    console.warn = jest.fn();
    getCatalogSpy.mockRejectedValueOnce(new Error("dummy error"));
    expect(listingsMarkupSpy).not.toBeCalled();
    // @ts-ignore
    const result = await handler(dummyEvent);
    expect(result?.body).toMatch(
      /tell your administrator an error occurred.*:.*:/i
    );
    expect(console.warn).toBeCalled();
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/index listings.*fail/i)
    );
  });

  it("warns and gives default markup if listingsMarkup fails", async () => {
    expect.assertions(3);
    console.warn = jest.fn();
    getCatalogSpy.mockResolvedValueOnce(["worksheet1"]);
    listingsMarkupSpy.mockRejectedValueOnce(new Error("dummy error"));
    // @ts-ignore
    const result = await handler(dummyEvent);
    expect(result?.body).toMatch(
      /tell your administrator an error occurred.*:.*:/i
    );
    expect(console.warn).toBeCalled();
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/index listings.*fail/i)
    );
  });

  it("warns with meaningful message if username missing from event", async () => {
    expect.assertions(4);
    console.warn = jest.fn();
    let badEvent = JSON.parse(JSON.stringify(dummyEvent));
    badEvent.requestContext.authorizer = undefined;
    const result = await handler(badEvent);
    expect(result?.body).toMatch(
      /tell your administrator an error occurred.*:.*:/i
    );
    expect(console.warn).toBeCalled();
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/index listings.*fail/i)
    );
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/missing username/i)
    );
  });

  //
});
