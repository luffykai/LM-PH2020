const fs = require("fs");
const sync_request = require("sync-request");

const argv = require("./commandsUtil.js");
const {
  getReleaseTagFromZhString,
  parseReleaesDateStringToIsoString,
  initPackage,
  outputPackage,
  postProcessing,
  writeJsonFile
} = require("./LMUtils");
const put = require("./put.js");
const getReleaseBuilder = require("./releaseBuilders.js");
const { convertToOc4idsInput, searchWithUnit } = require("./searchWithUnit.js");

const LM_OCDS_PREFIX = "ocds-kj3ygj";

const getContract = function(orgID, contractID) {
  res = sync_request(
    "GET",
    `https://pcc.g0v.ronny.tw/api/tender?unit_id=${orgID}&job_number=${contractID}`
  );
  return JSON.parse(res.getBody());
};

// Example: 3.80.11, 1090212-B2
const convertToOCDS = function(orgID, contractID) {
  const ocid = `${LM_OCDS_PREFIX}-${orgID}-${contractID}`;
  const contract = getContract(orgID, contractID);
  releasePackage = initPackage(ocid);

  for (let release of contract.records) {
    // console.log("BRIEF");
    // console.log(release.brief);

    const ocdsRelease = {};

    const releaseDate = parseReleaesDateStringToIsoString(
      release.date != null ? String(release.date) : null
    );
    const releaseTag = getReleaseTagFromZhString(release.brief.type);
    // Set general information from brief
    releaseDate && put(ocdsRelease, "date", releaseDate);

    put(ocdsRelease, "ocid", ocid);
    put(ocdsRelease, "id", `${release.filename}-${Date.parse(releaseDate)}`);
    put(ocdsRelease, "tag[]", releaseTag);

    // HardCode Data for each releases
    put(ocdsRelease, "language", "zh");
    put(ocdsRelease, "initiationType", "tender"); // Only tender is supported from this code list

    getReleaseBuilder(releaseTag).build(release.detail, ocdsRelease);

    // Post-processing for ocds release
    const processedOCDSRelease = postProcessing(ocdsRelease);
    releasePackage.releases.push(processedOCDSRelease);
  }
  return releasePackage;
};

const convertToOC4IDS = function(input) {
  let oc4ids = {};
  oc4ids.id = input.project_id;
  oc4ids.title = input.project_name;
  oc4ids.contractingProcesses = [];
  for (let contract of input.contracts) {
    releasePackage = convertToOCDS(contract.org_id, contract.contract_id);
    contractProcess = {};
    contractProcess.id = releasePackage.uri;
    contractProcess.releases = [];
    for (let release of releasePackage.releases) {
      contractProcess.releases.push(release);
    }
    oc4ids.contractingProcesses.push(contractProcess);
  }
  let oc4idsPackage = {
    uri: `ocds://contract/${input.project_id}`,
    publishedDate: new Date().toISOString(),
    publisher: {
      name: "Learning Man"
    },
    version: "0.9",
    projects: [oc4ids]
  };
  return oc4idsPackage;
};

main = function() {
  if (argv._.includes("search_with_unit")) {
    const data = convertToOC4IDS(
      convertToOc4idsInput(
        argv.project_id,
        searchWithUnit(argv.title, argv.unit_ids, argv.regex)
      )
    );
    writeJsonFile(`output/${argv.project_id}`, data);
  } else if (argv._.includes("convert_to_ocds")) {
    releasePackage = convertToOCDS(argv.org_id, argv.contract_id);
    outputPackage(releasePackage);
  } else if (argv._.includes("convert_to_oc4ids")) {
    const input = JSON.parse(fs.readFileSync(argv.input));
    const data = convertToOC4IDS(input);
    writeJsonFile("output/example_oc4ids", data);
  } else {
    console.log("sup bro!");
  }
};

main();
