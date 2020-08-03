const fs = require("fs");

const csvparse = require("csv-parse/lib/sync");

const fieldHandlers = require("./fieldHandlers");
const put = require("./put");

/*
 * Load the csv file and turn it into a Map Object
 * synchronously
 */
const loadMap = function() {
  const map = new Map();
  data = fs.readFileSync("data/field_map.csv");
  const records = csvparse(data, {
    columns: true,
    skip_empty_lines: true
  });

  for (record of records) {
    map.set(record.ronny_field, record.ocds_path);
  }

  return map;
};
const FIELD_MAP = loadMap();

const genericReleaseBuilder = {
  build: (releaseDetail, ocdsRelease) => {
    for (let key in releaseDetail) {
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
            ? fieldHandler(releaseDetail[key], ocdsRelease)
            : releaseDetail[key];

        //console.log("ocdsValue", ocdsValue);

        if (ocdsValue != null) {
          // ocds does not accept field with empty value (null and undefined)
          put(ocdsRelease, path, String(ocdsValue));
        }
      } else {
        console.error("no path for", key);
      }
    }
  }
};

module.exports = genericReleaseBuilder;