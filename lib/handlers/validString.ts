export function validString(x: unknown) {
  if (typeof x === "string" && x.length > 0) {
    return true;
  }
  return false;
}
