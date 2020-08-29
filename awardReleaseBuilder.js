const {
  ALREADY_IMPLIED_FIELDS,
  NON_MAPPING_FIELDS,
  getStringAfterColon,
  loadMap,
  parseAddressToOcdsAddress,
  parseTaiwaneseDateStringToDate,
  parseAmountToInt
} = require("./LMUtils");
const put = require("./put.js");
const fieldHandlers = require("./fieldHandlers");

const regexSupplierName = /^決標品項:第(\d)品項:得標廠商(\d):得標廠商$/;
const regexTendererName = /^投標廠商:投標廠商(\d):廠商名稱$/;
const regexCoTendererName = /^投標廠商:投標廠商(\d)\(共同投標廠商\)(\d):廠商名稱$/;

// super loose checking

// covered by populateTendererOrgObj
const alreadyCoveredSupplierRegex = /^決標品項:第(\d)品項:得標廠商(\d):.*/;
// covered by populateTendererOrgObj
const alreadyCoveredTendererRegex = /^投標廠商:投標廠商(\d):.*/;
const alreadyCoveredCoTendererNameRegex = /^投標廠商:投標廠商(\d)\(共同投標廠商\)(\d):.*/;
const alreadyCoveredItemNamesRegex = /^決標品項:第(\d)品項:.*/;

const AWARD_SPECIFIC_IMPLIED_FIELDS = {
  "最有利標:評選委員": "Already populated with populateCommitteesInParties",
  "決標品項:決標品項數": "Could be known by length items"
  //"決標資料:決標日期": "Already took care in init",
};

function getNextUnusedIndex(array) {
  return array != null ? array.length : 0;
}

// Returns the unit price rounded to an int.
function getUnitValueAmount(totalAmount, unit) {
  return Math.round(parseAmountToInt(totalAmount) / parseFloat(unit));
}

// Path in this mapping is relative to "awards".
const initializingFields = {
  date: "決標資料:決標日期",
  title: "已公告資料:標案名稱"
};

function initiateAwardForSupplier(supplierName, releaseDetail, ocdsRelease) {
  let supplierIdx = getNextUnusedIndex(ocdsRelease.awards);
  // The award might be just initiated and awards[0] will created an array here
  // so we cannot use ocdsRelease.awards[supplierIdx] as below directly.
  put(ocdsRelease, `awards[${supplierIdx}].suppliers[0].id`, supplierName);
  let award = ocdsRelease.awards[supplierIdx];
  put(award, "suppliers[0].name", supplierName);
  put(award, "status", "active");
  put(
    award,
    "date",
    parseTaiwaneseDateStringToDate(
      releaseDetail["決標資料:決標日期"]
    ).toISOString()
  );
  if (releaseDetail["已公告資料:標案名稱"]) {
    put(award, "title", releaseDetail["已公告資料:標案名稱"]);
  } else if (releaseDetail["採購資料:標案名稱"]) {
    put(award, "title", releaseDetail["採購資料:標案名稱"]);
  }
  return supplierIdx;
}

function populateItemInSupplierAward(match, releaseDetail, award) {
  const itemIdx = getNextUnusedIndex(award.items);
  put(
    award,
    `items[${itemIdx}].id`,
    releaseDetail[`決標品項:第${match[1]}品項:品項名稱`].hash()
  );
  put(
    award,
    `items[${itemIdx}].description`,
    releaseDetail[`決標品項:第${match[1]}品項:品項名稱`]
  );
  put(
    award,
    `items[${itemIdx}].quantity`,
    parseFloat(
      releaseDetail[
        `決標品項:第${match[1]}品項:得標廠商${match[2]}:預估需求數量`
      ]
    )
  );
  put(award, `items[${itemIdx}].unit.value.currency`, "TWD");
  put(
    award,
    `items[${itemIdx}].unit.value.amount`,
    getUnitValueAmount(
      releaseDetail[`決標品項:第${match[1]}品項:得標廠商${match[2]}:決標金額`],
      releaseDetail[
        `決標品項:第${match[1]}品項:得標廠商${match[2]}:預估需求數量`
      ]
    )
  );
}

function populateCommitteesInParties(releaseDetail, ocdsRelease) {
  const committeeField = releaseDetail["最有利標:評選委員"];
  if (!Array.isArray(committeeField) || committeeField.length == 0) {
    return;
  }

  for (let committeeMember of committeeField[0]) {
    put(ocdsRelease, "parties[]", {
      id: committeeMember["姓名"].hash(),
      name: committeeMember["姓名"],
      roles: ["reviewBody"],
      details: {
        occupation: committeeMember["職業"],
        hasAttendedMeeting: committeeMember["出席會議"] === "是" ? true : false
      }
    });
  }
}

function populateTendererOrgObj(prefix, releaseDetail, ocdsRelease) {
  let supplierOrgInfo = {
    name: releaseDetail[`${prefix}:廠商名稱`],
    id: releaseDetail[`${prefix}:廠商代碼`],
    address: parseAddressToOcdsAddress(releaseDetail[`${prefix}:廠商地址`]),
    contactPoint: {
      telephone: releaseDetail[`${prefix}:廠商電話`]
    },
    roles: ["tenderer"]
  };
  if (releaseDetail[`${prefix}:是否得標`] === "是") {
    supplierOrgInfo.roles.push("supplier");
  }
  put(ocdsRelease, "parties[]", supplierOrgInfo);
}

function updateSupplierIdInAward(supplierNameToIdMap, ocdsRelease) {
  if (ocdsRelease.awards == null || !Array.isArray(ocdsRelease.awards)) {
    return;
  }
  for (let award of ocdsRelease.awards) {
    let awardId = `${ocdsRelease["ocid"]}`;
    if (award.suppliers == null) {
      award.suppliers = [];
    }
    for (let supplier of award.suppliers) {
      supplier.id = supplierNameToIdMap.get(supplier.name);
      awardId = `${awardId}-${supplier.id}`;
    }
    award.id = awardId;
  }
}

function updateAwards(ocdsRelease) {
  if (ocdsRelease.awards == null || !Array.isArray(ocdsRelease.awards)) {
    return;
  }
  for (let award of ocdsRelease.awards) {
    let valueOfAward = 0;
    if (award.items == null) {
      award.items = [];
    }
    for (let item of award.items) {
      valueOfAward += item.unit.value.amount * item.quantity;
    }
    award.value = {
      amount: valueOfAward,
      currency: "TWD"
    };
  }
}

const FIELD_MAP = loadMap("award");

const awardReleaseBuilder = {
  build: (releaseDetail, ocdsRelease, unmappedFields) => {
    const supplierToIdxMap = new Map();
    const supplierNameToIdMap = new Map();
    for (let key in releaseDetail) {
      const value = releaseDetail[key];
      let match;
      if ((match = key.match(regexSupplierName))) {
        let supplierIdx = supplierToIdxMap.get(value);
        if (supplierIdx == null) {
          supplierIdx = initiateAwardForSupplier(
            value,
            releaseDetail,
            ocdsRelease
          );
          supplierToIdxMap.set(value, supplierIdx);
        }
        populateItemInSupplierAward(
          match,
          releaseDetail,
          ocdsRelease.awards[supplierIdx]
        );
        continue;
      } else if ((match = key.match(regexTendererName))) {
        populateTendererOrgObj(
          `投標廠商:投標廠商${match[1]}`,
          releaseDetail,
          ocdsRelease
        );
        supplierNameToIdMap.set(
          releaseDetail[key],
          releaseDetail[`投標廠商:投標廠商${match[1]}:廠商代碼`]
        );
        continue;
      } else if ((match = key.match(regexCoTendererName))) {
        populateTendererOrgObj(
          `投標廠商:投標廠商${match[1]}(共同投標廠商)${match[2]}`,
          releaseDetail,
          ocdsRelease
        );
        supplierNameToIdMap.set(
          releaseDetail[key],
          releaseDetail[
            `投標廠商:投標廠商${match[1]}(共同投標廠商)${match[2]}:廠商代碼`
          ]
        );
        continue;
      }
      // no award field regex matched
      let path = FIELD_MAP.get(key);
      if (path == null) {
        // try without first section
        path = FIELD_MAP.get(getStringAfterColon(key));
      }

      // Replace All the backslash to a dot
      path = path != null ? path.replace(/\//g, ".") : null;
      if (path) {
        const ocdsValue = releaseDetail[key];
        if (ocdsValue != null && path != null) {
          // ocds does not accept field with empty value (null and undefined)
          put(ocdsRelease, path, ocdsValue);
        }
        continue;
      }
      // Try the generic fieldHandler
      let fieldHandler = fieldHandlers[key];
      if (fieldHandler == null) {
        // try using the part after colon
        fieldHandler = fieldHandlers[getStringAfterColon(key)];
      }
      if (fieldHandler != null) {
        console.log("rescued: " + key);
        fieldHandler(releaseDetail[key], ocdsRelease, releaseDetail);
        continue;
      }
      // no mapped
      if (
        !NON_MAPPING_FIELDS.has(key) &&
        releaseDetail[key] !== "" &&
        !(key in ALREADY_IMPLIED_FIELDS) &&
        !(key in AWARD_SPECIFIC_IMPLIED_FIELDS) &&
        key.match(alreadyCoveredSupplierRegex) == null &&
        key.match(alreadyCoveredTendererRegex) == null &&
        key.match(alreadyCoveredCoTendererNameRegex) == null &&
        key.match(alreadyCoveredItemNamesRegex) == null
      ) {
        unmappedFields[key] = String(releaseDetail[key]).replace(/\s/g, "");
        console.log("no path for", key, " value = ", releaseDetail[key]);
      }
    }
    populateCommitteesInParties(releaseDetail, ocdsRelease);
    updateSupplierIdInAward(supplierNameToIdMap, ocdsRelease);
    updateAwards(ocdsRelease);
  }
};

module.exports = awardReleaseBuilder;
