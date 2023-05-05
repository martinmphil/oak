export function validStringArray(x: unknown): string[] {
  if (
    x &&
    Array.isArray(x) &&
    x.length > 0 &&
    x.every((el) => typeof el === "string" && el.length > 0)
  ) {
    return x;
  }

  let arr = [];
  if (x && Array.isArray(x) && x.length > 0) {
    arr = x.filter((el) => typeof el === "string" && el.length > 0);
  }
  if (arr.length > 0) {
    return arr;
  }

  throw new Error(
    ` Our databank supplied a malformed array of strings:- ${JSON.stringify(
      x
    )} `
  );
}
