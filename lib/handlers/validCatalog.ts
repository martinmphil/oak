export function validCatalog(arr: string[]) {
  if (
    arr &&
    Array.isArray(arr) &&
    arr.length > 0 &&
    arr.every((el) => typeof el === "string" && el.length > 0)
  ) {
    return true;
  }

  if (arr === undefined || arr === null) {
    console.warn(` Our databank failed to supply a catalog. `);
    return false;
  }

  if (Array.isArray(arr) === false) {
    console.warn(` Our databank failed to supply a catalog as an array. `);
    return false;
  }

  if (arr.length < 1) {
    console.warn(` Our databank supplied a catalog as an empty array. `);
    return false;
  }

  if (
    arr.every((el: any) => typeof el === "string" && el.length > 0) === false
  ) {
    console.warn(` Our databank supplied a malformed catalog. `);
    return false;
  }

  return false;
}
