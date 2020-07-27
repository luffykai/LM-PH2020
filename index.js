const fs = require("fs");
const request = require("request");
const sync_request = require("sync-request");

const parse = require("csv-parse/lib/sync");

/*
 * Load the csv file and turn it into a Map Object
 * synchronously
 */
const loadMap = function () {
  const map = new Map();
  data = fs.readFileSync("data/field_map.csv");
  const records = parse(data, {
    columns: true,
    skip_empty_lines: true,
  });

  for (record of records) {
    map.set(record.ronny_field, record.ocds_path);
  }

  return map;
};

const getContract = function (org_id, contract_id) {
  res = sync_request(
    "GET",
    "https://pcc.g0v.ronny.tw/api/tender?unit_id=" +
      org_id +
      "&job_number=" +
      contract_id
  );
  return JSON.parse(res.getBody());
};

main = function () {
  const FIELD_MAP = loadMap();
  var contract = getContract("3.80.11", "1090212-B2");
  console.log(contract);
  for (var release of contract.records) {
    console.log(release.brief);
    for (var key in release.detail) {
      console.log(FIELD_MAP.get(key));
    }
  }
};

main();
