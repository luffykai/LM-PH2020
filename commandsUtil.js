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
  .command("search_list", "Search all projects in the list", {
    input: {
      description: "The input file to read from",
      alias: "in"
    },
    update_db: {
      description: "If true, write to Firebase Firestore.",
      type: "boolean",
      alias: "update"
    }
  })
  .command("search_single", "Search a single project", {
    project_row: {
      description: "The project row represented in the CSV file",
      alias: "p"
    },
    update_db: {
      description: "If true, write to Firebase Firestore.",
      type: "boolean",
      alias: "update"
    }
  })
  .string([
    "pid",
    "title",
    "unit_ids",
    "regex",
    "org_id",
    "contract_id",
    "project_row"
  ])
  .help()
  .alias("help", "h").argv;

module.exports = argv;
