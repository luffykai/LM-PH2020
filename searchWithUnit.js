const jsesc = require("jsesc");
const sync_request = require("sync-request");

const getFilteredRecord = function (records, unitIds) {
  return records.filter(function (record) {
    return unitIds.includes(record["unit_id"]);
  });
};

const mergeRecords = function (records) {
  const mergedRecords = {};
  for (let record of records) {
    if (record["job_number"] in mergedRecords) {
      continue;
    }
    const recordJobNum = record["job_number"];
    mergedRecords[recordJobNum] = {};
    mergedRecords[recordJobNum]["tender_api_url"] = record["tender_api_url"];
    mergedRecords[recordJobNum]["title"] = record["brief"]["title"];
    mergedRecords[recordJobNum]["date"] = record["date"];
  }
  return mergedRecords;
};

const searchByTitleAndUnitIds = function (query, unitIds) {
  let filteredRecords = [];
  let currPage = 0;
  let total_pages = 1;
  do {
    res = sync_request(
      "GET",
      `https://pcc.g0v.ronny.tw/api/searchbytitle?query=${query}&page=${
        currPage + 1
      }`
    );
    res_json = JSON.parse(res.getBody());
    filteredRecords = filteredRecords.concat(
      getFilteredRecord(res_json["records"], unitIds)
    );
    currPage = res_json["page"];
    total_pages = res_json["total_pages"];
  } while (currPage < total_pages);
  return filteredRecords;
};

const filterTitleWithRegex = function (records, regex) {
  for (let key in records) {
    if (records[key]["title"].search(regex) < 0) {
      delete records[key];
    }
  }
  return records;
};


function searchWithUnit(rawTitle, unitIds, rawRegex) {
  const title = jsesc(rawTitle);
  let mergedRecords = mergeRecords(
    searchByTitleAndUnitIds(title, unitIds)
  );
  if (rawRegex != null) {
    const regex = jsesc(rawRegex);
    mergedRecords = filterTitleWithRegex(mergedRecords, regex);
  }
  console.log("======== Procurements ========");
  console.log(mergedRecords);
  console.log(`Total: ${Object.keys(mergedRecords).length} matches.`);
}

module.exports = searchWithUnit;