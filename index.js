const fs = require("fs");
const request = require("request");
const sync_request = require("sync-request");

const put = require("./put.js");
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
  const contract = getContract("3.80.11", "1090212-B2");
  console.log(contract);

  const ocdsRecord = {};

  for (let release of contract.records) {
    console.log(release.brief);
    for (let key in release.detail) {
      // For each field in the Ronny API, we find our mapping to
      // the OCDS Fields path. If the path is found, we set it
      // into an object.
      let path = FIELD_MAP.get(key);
      path = path != null ? path.replace("/", ".") : null;
      if (path) {
        put(ocdsRecord, path, release.detail[key]);
      } else {
        console.error("no path for", key);
      }
    }
  }

  console.log('OCDS Result');
  console.log(ocdsRecord);
};

main();
