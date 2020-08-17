const fs = require("fs");

const csvparse = require("csv-parse/lib/sync");
const admin = require("firebase-admin");

const argv = require("./commandsUtil.js");
const {
  outputPackage,
  printProjectHeader,
  writeJsonFile
} = require("./LMUtils");
const {
  convertToOC4IDS,
  convertToOC4IDSInput,
  convertToOCDS
} = require("./conversionUtil");

const { searchWithUnit } = require("./searchWithUnit.js");
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
    const compiledData = {};
    for (let p of projects) {
      const regex = `${p.regex}.*((安置)|(社會)|(公共)|(住宅))`;
      const uids = p.uid.split(" ");
      const pidHash = p.pid.hash();
      printProjectHeader(p, regex);
      const oc4ids = convertToOC4IDS(
        convertToOC4IDSInput(p.pid, searchWithUnit(p.title, uids, regex))
      );
      compiledData[pidHash] = oc4ids;
      // await db.collection("counties")
      //   .doc(p.county)
      //   .collection("projects")
      //   .doc(pidBase64)
      //   .set(oc4ids);
    }
    writeJsonFile(`output/all/full.json`, compiledData);
  } else {
    console.log("sup bro!");
  }
};

main();

module.exports = {
  convertToOCDS
};
