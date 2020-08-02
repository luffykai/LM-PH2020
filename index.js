const sync_request = require("sync-request");
const yargs = require("yargs");

const put = require("./put.js");

const {
  getReleaseTagFromZhString,
  getTimestampWithDateString,
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
    const releaseTag = getReleaseTagFromZhString(release.brief.type);
    // Set general information from brief
    releaseDate && put(ocdsRelease, "date", releaseDate);
    put(ocdsRelease, "id", release.filename);
    put(ocdsRelease, "ocid", `${LM_OCDS_PREFIX}-${release.filename}`);
    put(ocdsRelease, "tag", releaseTag);
    // HardCode Data for each releases
    put(ocdsRelease, "language", "zh");
    put(ocdsRelease, "initiationType", "tender"); // Only tender is supported from this code list

    getReleaseBuilder(releaseTag).build(release.detail, ocdsRelease);

    // Post-processing for ocds release
    const processedOCDSRelease = postProcessing(ocdsRelease);

    console.log("===== OCDS Release =====");
    console.dir(processedOCDSRelease, { colors: true, depth: null });
  }
};
main = function () {
  if (argv._.includes("search_with_unit")) {
    searchWithUnit(argv.title, argv.unit_ids, argv.regex);
  } else if (argv._.includes("convert_to_ocds")) {
    convertToOCDS(argv.org_id, argv.contract_id);
  } else {
    console.log("sup bro!");
  }
};

main();
