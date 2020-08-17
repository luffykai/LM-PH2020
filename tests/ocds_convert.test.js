const fs = require("fs");
const { convertToOCDS } = require("../index.js");

test("convert case 1", () => {
  let releasePackage = convertToOCDS("3.79", "1070807C0140");
  delete releasePackage.publishedDate;
  expected = JSON.stringify(JSON.parse(fs.readFileSync("./tests/ocds-kj3ygj-3.79-1070807C0140")));
  expect(JSON.stringify(releasePackage)).toBe(expected);
});