const fs = require("fs");
const request = require("request");
const sync_request = require("sync-request");
const yargs = require("yargs");
const jsesc = require('jsesc');

const put = require("./put.js");
const csvparse = require("csv-parse/lib/sync");
const {
  getReleaseTagFromZhString,
  getTimestampWithDateString
} = require("./LMUtils");
const fieldHandlers = require("./fieldHandlers");

const argv = yargs
  .command("search_with_unit", "Search title with associated unit IDs.", {
    title: {
      description: "The title to search for",
      alias: "t",
      demandOption: true
    },
    unit_ids: {
      description: "The unit ID to filter with",
      alias: "uid",
      type: "array",
      demandOption: true
    },
    regex: {
      description: "Additional regex to filter the title",
      alias: "r",
    }
  })
  .command("convert_to_ocds", "Convert the given contract to OCDS format", {
    org_id: {
      description: "The id or organization",
      alias: "org",
    },
    contract_id: {
      description: "The ID of the contract",
      alias: "c"
    }
  })
  .string(["title", "unit_ids", "regex", "org_id", "contract_id"]) // Ensure "3.79" is parsed as string not number.
  .help()
  .alias("help", "h").argv;

const LM_OCDS_PREFIX = "ocds-kj3ygj";

/*
 * Load the csv file and turn it into a Map Object
 * synchronously
 */
const loadMap = function () {
  const map = new Map();
  data = fs.readFileSync("data/field_map.csv");
  const records = csvparse(data, {
    columns: true,
    skip_empty_lines: true,
  });

  for (record of records) {
    map.set(record.ronny_field, record.ocds_path);
  }

  return map;
};

const getContract = function (orgID, contractID) {
  res = sync_request(
    "GET",
    `https://pcc.g0v.ronny.tw/api/tender?unit_id=${orgID}&job_number=${contractID}`
  );
  return JSON.parse(res.getBody());
};

const getFilteredRecord = function(records, unit_ids) {
  return records.filter(function(record) {
    return unit_ids.includes(record["unit_id"]);
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
  }
  return mergedRecords;
};

const searchByTitleAndUnitIds = function(query, unit_ids) {
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
      getFilteredRecord(res_json["records"], unit_ids)
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
}

// Example: 3.80.11, 1090212-B2
const convertToOCDS = function(orgID, contractID) {

  const FIELD_MAP = loadMap();
  const contract = getContract(orgID, contractID);
  console.log("org: " + orgID + " contract: " + contractID);
  console.log("Contract");
  console.log(contract);

  for (let release of contract.records) {
    console.log("BRIEF");
    console.log(release.brief);

    const ocdsRelease = {};

    const releaseDate = getTimestampWithDateString(
      release.date != null ? String(release.date) : null
    );
    // Set general information from brief
    releaseDate && put(ocdsRelease, "date", releaseDate);
    put(ocdsRelease, "id", release.filename);
    put(ocdsRelease, "ocid", `${LM_OCDS_PREFIX}-${release.filename}`);
    put(ocdsRelease, "tag", getReleaseTagFromZhString(release.brief.type));
    // HardCode Data for each releases
    put(ocdsRelease, 'language', 'zh');
    put(ocdsRelease, 'initiationType', 'tender'); // Only tender is supported from this code list

    for (let key in release.detail) {
      // For each field in the Ronny API, we find our mapping to
      // the OCDS Fields path. If the path is found, we set it
      // into an object.
      let path = FIELD_MAP.get(key);
      const fieldHandler = fieldHandlers[key];

      // Replace All the backslash to a dot
      path = path != null ? path.replace(/\//g, ".") : null;
      if (path) {
        const ocdsValue =
          fieldHandler != null
            ? fieldHandler(release.detail[key])
            : release.detail[key];
        put(ocdsRelease, path, ocdsValue);
      } else {
        console.error("no path for", key);
      }
    }

    console.log("===== OCDS Release =====");
    console.log(ocdsRelease);
  }
}
main = function() {
  const inputArg = process.argv.slice(2);
  if (argv._.includes("search_with_unit")) {
    const title = jsesc(argv.title);
    let mergedRecords = mergeRecords(
        searchByTitleAndUnitIds(title, argv.unit_ids));
    if (argv.regex) {
      const regex = jsesc(argv.regex);
      mergedRecords = filterTitleWithRegex(mergedRecords, regex);
    }
    console.log("======== Procurements ========");
    console.log(mergedRecords);
    console.log(`Total: ${Object.keys(mergedRecords).length} matches.`);
    return;
  } else if (argv._.includes("convert_to_ocds")) {
    convertToOCDS(argv.org_id, argv.contract_id);
  } else {
    console.log("sup bro!");
  }
};

main();
