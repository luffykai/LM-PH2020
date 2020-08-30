const fs = require("fs");

const csvparse = require("csv-parse/lib/sync");
const admin = require("firebase-admin");

const argv = require("./commandsUtil.js");
const { outputPackage, writeJsonFile } = require("./LMUtils");
const {
  convertToOC4IDS,
  convertToOC4IDSInput,
  convertToOCDS
} = require("./conversionUtil");

const {
  searchAllAndUpdateFirebase,
  searchAndUpdateFirebase,
  searchWithUnit
} = require("./searchWithUnit.js");
const serviceAccount = require("./lm-ph2020-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lm-ph2020.firebaseio.com"
});
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

main = async function() {
  if (argv._.includes("search_with_unit")) {
    const data = convertToOC4IDS(
      convertToOC4IDSInput(
        argv.project_id,
        searchWithUnit(argv.title, argv.unit_ids, argv.regex)
      )
    );
    writeJsonFile(`output/all/${argv.project_id}`, data);
  } else if (argv._.includes("convert_to_ocds")) {
    releasePackage = convertToOCDS(argv.org_id, argv.contract_id);
    outputPackage(releasePackage);
  } else if (argv._.includes("convert_to_oc4ids")) {
    const input = JSON.parse(fs.readFileSync(argv.input));
    const data = convertToOC4IDS(input);
    writeJsonFile("output/example_oc4ids", data);
  } else if (argv._.includes("search_list")) {
    const project_csv = fs.readFileSync(argv.input);
    const projects = csvparse(project_csv, {
      columns: true,
      skip_empty_lines: true
    });
    await searchAllAndUpdateFirebase(db, projects, argv.update_db);
  } else if (argv._.includes("search_single")) {
    const tokens = argv.project_row.split(",");
    await searchAndUpdateFirebase(
      db,
      {
        pid: tokens[0],
        uid: tokens[1],
        title: tokens[2],
        regex: tokens[3],
        county: tokens[4],
        latlngs: tokens[5]
      },
      argv.update_db
    );
  } else {
    console.log("sup bro!");
  }
};

main();

module.exports = {
  convertToOCDS
};
