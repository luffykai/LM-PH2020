const csv = require("csv-parser");
const fs = require("fs");
const request = require("request");
const sync_request = require("sync-request");

const FIELD_MAP = {};

const loadMap = function() {
  fs.createReadStream("data/field_map.csv")
    .pipe(csv())
    .on("data", (row) => (FIELD_MAP[row.ronny_field] = row.ocds_path))
    .on("end", () => {
      console.log(FIELD_MAP);
    });
}

const getContract = function(org_id, contract_id) {
  res = sync_request("GET", "https://pcc.g0v.ronny.tw/api/tender?unit_id=" + org_id + "&job_number=" + contract_id);
  return JSON.parse(res.getBody());
}

main = function() {
  loadMap();
  var contract = getContract2("3.80.11", "1090212-B2");
  console.log(contract);
  for (var release of contract.records) {
    console.log(release.brief);
    for (var key in release.detail) {
      console.log(key);
    }
    break;
  }
  console.log("1");
}

main();
