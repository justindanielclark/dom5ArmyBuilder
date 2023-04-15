export function isNumber(str: string): boolean {
  const numRegex = /^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/;
  return numRegex.test(str);
}
