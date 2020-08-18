const jsesc = require("jsesc");
const sync_request = require("sync-request");

const { convertToOC4IDS, convertToOC4IDSInput } = require("./conversionUtil");
const { printProjectHeader, writeJsonFile } = require("./LMUtils");

const getFilteredRecord = function(records, unitIds) {
  return records.filter(function(record) {
    return unitIds.includes(record["unit_id"]);
  });
};

const mergeRecords = function(records) {
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
    mergedRecords[recordJobNum]["unit_id"] = record["unit_id"];
  }
  return mergedRecords;
};

const searchByTitleAndUnitIds = function(query, unitIds) {
  let filteredRecords = [];
  let currPage = 0;
  let total_pages = 1;
  do {
    res = sync_request(
      "GET",
      `https://pcc.g0v.ronny.tw/api/searchbytitle?query=${query}&page=${currPage +
        1}`
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

const filterTitleWithRegex = function(records, regex) {
  for (let key in records) {
    if (records[key]["title"].search(regex) < 0) {
      delete records[key];
    }
  }
  return records;
};

const searchWithUnit = function(rawTitle, unitIds, rawRegex) {
  const title = jsesc(rawTitle);
  let mergedRecords = mergeRecords(searchByTitleAndUnitIds(title, unitIds));
  if (rawRegex != null) {
    const regex = jsesc(rawRegex);
    mergedRecords = filterTitleWithRegex(mergedRecords, regex);
  }
  console.log(`  * Total: ${Object.keys(mergedRecords).length} matches.`);
  for (let key in mergedRecords) {
    console.log("    - " + mergedRecords[key]["title"]);
    console.log("      " + mergedRecords[key]["tender_api_url"]);
  }
  return mergedRecords;
};

const searchAndUpdateFirebase = async function(db, projectRow, updateDb) {
  const regex = `${projectRow.regex}.*((安置)|(社會)|(公共)|(住宅))`;
  const uids = projectRow.uid.split(" ");
  printProjectHeader(projectRow, regex);
  const oc4ids = convertToOC4IDS(
    convertToOC4IDSInput(
      projectRow.pid,
      searchWithUnit(projectRow.title, uids, regex)
    )
  );
  if (!updateDb) {
    return oc4ids;
  }
  await db
    .collection("counties")
    .doc(projectRow.county)
    .collection("projects")
    .doc(projectRow.pid.hash())
    .set(oc4ids);
  return oc4ids;
};

const searchAllAndUpdateFirebase = async function(db, projects, updateDb) {
  let promises = [];
  let pidHashes = [];
  for (let project of projects) {
    promises.push(searchAndUpdateFirebase(db, project, updateDb));
    pidHashes.push(project.pid.hash());
  }
  Promise.all(promises).then(values => {
    const compiledData = {};
    for (let i = 0; i < values.length; i++) {
      compiledData[pidHashes[i]] = values[i];
    }
    writeJsonFile(`output/all/full.json`, compiledData);
  });
};

module.exports = {
  searchAllAndUpdateFirebase,
  searchAndUpdateFirebase,
  searchWithUnit
};
