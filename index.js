const fs = require("fs");
const request = require("request");
const sync_request = require("sync-request");

const put = require("./put.js");
const parse = require("csv-parse/lib/sync");
const { getReleaseTagFromZhString, getTimestampWithDateString } = require("./LMUtils");
const fieldHandlers = require("./fieldHandlers");

const LM_OCDS_PREFIX = "ocds-kj3ygj";

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

const getContract = function (orgID, contractID) {
  res = sync_request(
    "GET",
    `https://pcc.g0v.ronny.tw/api/tender?unit_id=${orgID}&job_number=${contractID}`
  );
  return JSON.parse(res.getBody());
};

main = function () {
  const FIELD_MAP = loadMap();
  const contract = getContract("3.80.11", "1090212-B2");
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
};

main();
