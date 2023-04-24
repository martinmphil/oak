import { validStringArray } from "../../lib/handlers/validStringArray";

describe("valid catalog function", () => {
  it("should return the argument if the argument is an array of strings", () => {
    const maybeCatalog = ["test"];
    const result = validStringArray(maybeCatalog);
    expect(result).toBe(maybeCatalog);
  });

  it("should return an array of strings", () => {
    const maybeCatalog = ["a", "b", "c"];
    const result = validStringArray(maybeCatalog);
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("should remove empty strings from argument array", () => {
    const maybeCatalog = ["a", "", "b", "c", ""];
    const result = validStringArray(maybeCatalog);
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("should return only an array of strings", () => {
    const maybeCatalog = [1, 2, 3, "a", 4, 5, "b", "c", ""];
    const result = validStringArray(maybeCatalog);
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("should not return an empty array", () => {
    const maybeCatalog = ["", "", "", "", ""];
    expect(() => {
      validStringArray(maybeCatalog);
    }).toThrowError(/databank supplied a malformed array of strings.*\[.*\]/i);
  });

  it("should throw an error if the argument is a string", () => {
    const maybeCatalog = "string";
    expect(() => {
      validStringArray(maybeCatalog);
    }).toThrowError(/databank supplied a malformed array of strings.*string/i);
  });

  it("should throw an error if the argument is a number", () => {
    const maybeCatalog = 1;
    expect(() => {
      validStringArray(maybeCatalog);
    }).toThrowError(/databank supplied a malformed array of strings.*1/i);
  });

  it("should throw an error if the argument is not an array of strings", () => {
    const maybeCatalog = [1, 2, 3];
    expect(() => {
      validStringArray(maybeCatalog);
    }).toThrowError(
      /databank supplied a malformed array of strings.*\[1,2,3\]/i
    );
  });

  it("should throw an error if the argument is empty", () => {
    const maybeCatalog: unknown[] = [];
    expect(() => {
      validStringArray(maybeCatalog);
    }).toThrowError(/databank supplied a malformed array of strings.*\[\]/i);
  });

  it("should throw an error if the argument is undefined", () => {
    const maybeCatalog = undefined;
    expect(() => {
      validStringArray(maybeCatalog);
    }).toThrowError(
      /databank supplied a malformed array of strings.*undefined/i
    );
  });

  it("should throw an error if the argument is null", () => {
    const maybeCatalog = null;
    expect(() => {
      validStringArray(maybeCatalog);
    }).toThrowError(/databank supplied a malformed array of strings/i);
  });
});
