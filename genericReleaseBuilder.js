const fs = require("fs");

const csvparse = require("csv-parse/lib/sync");

const fieldHandlers = require("./fieldHandlers");
const put = require("./put");
const {
  ALREADY_IMPLIED_FIELDS,
  NON_MAPPING_FIELDS,
  getStringAfterColon,
  loadMap,
} = require("./LMUtils");

const FIELD_MAP = loadMap();

const genericReleaseBuilder = {
  build: (releaseDetail, ocdsRelease, unmappedFields) => {
    for (let key in releaseDetail) {
      // For each field in the Ronny API, we find our mapping to
      // the OCDS Fields path. If the path is found, we set it
      // into an object.
      let path = FIELD_MAP.get(key);
      let fieldHandler = fieldHandlers[key];
      if (fieldHandler == null) {
        // try using the part after colon
        fieldHandler = fieldHandlers[getStringAfterColon(key)];
      }

      // Replace All the backslash to a dot
      path = path != null ? path.replace(/\//g, ".") : null;
      if (path || fieldHandler) {
        const ocdsValue =
          fieldHandler != null
            ? fieldHandler(releaseDetail[key], ocdsRelease, releaseDetail)
            : releaseDetail[key];

        //console.log("ocdsValue", ocdsValue);

        if (ocdsValue != null && path != null) {
          // ocds does not accept field with empty value (null and undefined)
          put(ocdsRelease, path, ocdsValue);
        }
      } else {
        // key not mapped so far
        let unmapped = true;
        // try the second part only
        path = FIELD_MAP.get(getStringAfterColon(key));
        if (path) {
          put(ocdsRelease, path, releaseDetail[key]);
          unmapped = false;
        }
        if (
          unmapped &&
          !NON_MAPPING_FIELDS.has(key) &&
          releaseDetail[key] !== "" &&
          !(key in ALREADY_IMPLIED_FIELDS)
        ) {
          unmappedFields[key] = String(releaseDetail[key]).replace(/\s/g, "");
          console.log("no path for", key, " value = ", releaseDetail[key]);
        }
      }
    }
  },
};

module.exports = genericReleaseBuilder;
