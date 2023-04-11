import { validCatalog } from "../../lib/handlers/validCatalog";

describe("validating catalog", () => {
  const originalWarn = console.warn;
  afterEach(() => (console.warn = originalWarn));

  it("returns true for good array", () => {
    expect.assertions(1);
    const goodArray1 = ["wflow1", "wflow2", "wflow3", "wflow4"];
    expect(validCatalog(goodArray1)).toBeTruthy();
  });

  it("warns about undefined arguments", () => {
    console.warn = jest.fn();
    expect.assertions(2);
    //@ts-ignore
    expect(validCatalog()).toBe(false);
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/failed.*catalog/i)
    );
  });

  it("warns if argument is not an array", () => {
    console.warn = jest.fn();
    expect.assertions(2);
    //@ts-ignore
    expect(validCatalog(9)).toBe(false);
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/failed to supply a catalog as an array/i)
    );
  });

  it("warns if array is empty", () => {
    console.warn = jest.fn();
    expect.assertions(2);
    //@ts-ignore
    expect(validCatalog([])).toBe(false);
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/supplied.*empty array/i)
    );
  });

  it("warns if empty elements are empty strings", () => {
    const badArray1 = ["wflow1", "wflow2", "", "wflow4"];
    console.warn = jest.fn();
    expect.assertions(2);
    //@ts-ignore
    expect(validCatalog(badArray1)).toBe(false);
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/malformed.*catalog/i)
    );
  });

  it("warns if empty elements are not strings", () => {
    const badArray2 = ["wflow1", "wflow2", 9, "wflow4"];
    console.warn = jest.fn();
    expect.assertions(2);
    //@ts-ignore
    expect(validCatalog(badArray2)).toBe(false);
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/malformed.*catalog/i)
    );
  });

  it("warns if empty elements are objects", () => {
    const badArray3 = ["wflow1", { dummy_key: "dummy_string" }];
    console.warn = jest.fn();
    expect.assertions(2);
    //@ts-ignore
    expect(validCatalog(badArray3)).toBe(false);
    expect(console.warn).toBeCalledWith(
      expect.stringMatching(/malformed.*catalog/i)
    );
  });

  //
});
