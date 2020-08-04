const yargs = require("yargs");

const argv = yargs
  .command(
    "search_with_unit",
    "Search title with associated unit IDs and build a OC4IDS package",
    {
      project_id: {
        description: "The project ID used to build OC4IDS",
        alias: "pid",
        demandOption: true
      },
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
        alias: "r"
      }
    }
  )
  .command("convert_to_ocds", "Convert the given contract to OCDS format", {
    org_id: {
      description: "The id or organization",
      alias: "org"
    },
    contract_id: {
      description: "The ID of the contract",
      alias: "c"
    }
  })
  .command("convet_to_oc4ids", "Convert data into OC4IDS format", {
    input: {
      description: "The input file to read from",
      alias: "in"
    }
  })
  .string(["pid", "title", "unit_ids", "regex", "org_id", "contract_id"])
  .help()
  .alias("help", "h").argv;

  module.exports = argv;