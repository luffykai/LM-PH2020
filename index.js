const fs = require("fs");
const sync_request = require("sync-request");
const yargs = require("yargs");

const put = require("./put.js");

const {
  getReleaseTagFromZhString,
  parseReleaesDateStringToIsoString,
  initPackage,
  outputPackage,
  postProcessing,
} = require("./LMUtils");

const getReleaseBuilder = require("./releaseBuilders.js");
const searchWithUnit = require("./searchWithUnit.js");

const argv = yargs
  .command("search_with_unit", "Search title with associated unit IDs.", {
    title: {
      description: "The title to search for",
      alias: "t",
      demandOption: true,
    },
    unit_ids: {
      description: "The unit ID to filter with",
      alias: "uid",
      type: "array",
      demandOption: true,
    },
    regex: {
      description: "Additional regex to filter the title",
      alias: "r",
    },
  })
  .command("convert_to_ocds", "Convert the given contract to OCDS format", {
    org_id: {
      description: "The id or organization",
      alias: "org",
    },
    contract_id: {
      description: "The ID of the contract",
      alias: "c",
    },
  })
  .command("convet_to_oc4ids", "Convert data into OC4IDS format", {
    input: {
      description: "The input file to read from",
      alias: "in",
    }
  })
  .string(["title", "unit_ids", "regex", "org_id", "contract_id"]) // Ensure "3.79" is parsed as string not number.
  .help()
  .alias("help", "h").argv;

const LM_OCDS_PREFIX = "ocds-kj3ygj";

const getContract = function (orgID, contractID) {
  res = sync_request(
    "GET",
    `https://pcc.g0v.ronny.tw/api/tender?unit_id=${orgID}&job_number=${contractID}`
  );
  return JSON.parse(res.getBody());
};

// Example: 3.80.11, 1090212-B2
const convertToOCDS = function (orgID, contractID) {
  const contract = getContract(orgID, contractID);
  releasePackage = initPackage(contractID);

  for (let release of contract.records) {
    //console.log("BRIEF");
    //console.log(release.brief);

    const ocdsRelease = {};

    const releaseDate = parseReleaesDateStringToIsoString(
      release.date != null ? String(release.date) : null
    );
    const releaseTag = getReleaseTagFromZhString(release.brief.type);
    // Set general information from brief
    releaseDate && put(ocdsRelease, "date", releaseDate);

    put(ocdsRelease, "id", `${release.filename}-${Date.parse(releaseDate)}`);
    put(ocdsRelease, "ocid", `${LM_OCDS_PREFIX}-${ocdsRelease.id}`);
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

const convertToOC4IDS = function(input_file) {
  const input = JSON.parse(fs.readFileSync(input_file));
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
  return oc4ids;
}

main = function () {
  if (argv._.includes("search_with_unit")) {
    searchWithUnit(argv.title, argv.unit_ids, argv.regex);
  } else if (argv._.includes("convert_to_ocds")) {
    releasePackage = convertToOCDS(argv.org_id, argv.contract_id);
    outputPackage(releasePackage);
  } else if (argv._.includes("convert_to_oc4ids")) {
    const data = convertToOC4IDS(argv.input);
    fs.writeFile("output/example_oc4ids", JSON.stringify(data, null, 4), (err) => {
      if (err) {
          throw err;
      }
      console.log("JSON data is saved.");
    });
  } else {
    console.log("sup bro!");
  }
};

main();
