const request = require("request");

const csv = require("csv-parser");
const fs = require("fs");

const FIELD_MAP = {};

fs.createReadStream("data/field_map.csv")
  .pipe(csv())
  .on("data", (row) => (FIELD_MAP[row.ronny_field] = row.ocds_path))
  .on("end", () => {
    console.log(FIELD_MAP);
  });

request('https://pcc.g0v.ronny.tw/api', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body);
  console.log(body.url);
  console.log(body.explanation);
});
