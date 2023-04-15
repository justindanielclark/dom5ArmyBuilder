import { isNumber } from "../isNumber";
test("Basic Testing Works", () => {
  expect(1).toBe(1);
});
test("Test1", () => {
  expect(isNumber("1")).toBe(true);
});
test("Test2", () => {
  expect(isNumber("1234")).toBe(true);
});
test("Test3", () => {
  expect(isNumber("12.3")).toBe(true);
});
test("Test4", () => {
  expect(isNumber(".123")).toBe(true);
});
test("Test5", () => {
  expect(isNumber("1a1")).toBe(false);
});
test("Test6", () => {
  expect(isNumber("aaaaa")).toBe(false);
});
test("Test7", () => {
  expect(isNumber("1.1.")).toBe(false);
});
test("Test8", () => {
  expect(isNumber("1.")).toBe(true);
});
