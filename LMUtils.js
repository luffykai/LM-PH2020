const crypto = require("crypto");
const fs = require("fs");
const URL = require("url").URL;
const csvparse = require("csv-parse/lib/sync");

const TAIWANESE_YEAR_OFFSET = 1911;

// Fields that shouldn't be printed while we check what fields we haven't
// map yet. Only for debugging purpose, we could still use the fields and
// its values.
const NON_MAPPING_FIELDS = new Set(["type", "type2", "url", "fetched_at"]);

// An Object listing all the fields that we don't need to map
// and the reason, logic of not needing it is listed as the value of the object.
// Common reasons are that some fields are actually implied from existing fields.
const ALREADY_IMPLIED_FIELDS = {
  // '採購資料:預算金額是否公開': "",
  "採購資料:本採購案是否屬於建築工程":
    "already covered in getProcurementCategory",
  "決標資料:決標日期": "already processed when initializing",
  "是否為商業財物或服務": "already covered in getProcurementCategory"
};

Object.defineProperty(String.prototype, "hash", {
  value: function() {
    return crypto.createHash('md5').update(this.toString()).digest('hex');
  }
});

/*
 * Input: "20200708"
 * Output: "2020-07-07T16:00:00.000Z"
 * This is a Utils to get ISO DateTime string in +08:00 timezone for each releases
 */
function parseReleaesDateStringToIsoString(dateString) {
  if (dateString == null || dateString === "") {
    return null;
  }

  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6);
  return new Date(
    Date.parse(`${year}-${month}-${day} 00:00:00+08:00`)
  ).toISOString();
}

// Apply Taiwanese year offset and make sure the timezone is correct (+08:00)
function parseTaiwaneseDateStringToDate(dateString) {
  if (dateString == null || dateString === "") {
    return null;
  }
  const match = dateString.match(/([0-9]{1,3})/g);
  if (match.length < 3) {
    return null;
  }
  let formattedDateString = `${parseInt(match[0]) + TAIWANESE_YEAR_OFFSET}-${
    match[1]
  }-${match[2]}`;
  if (match.length == 5) {
    formattedDateString = `${formattedDateString} ${match[3]}:${
      match[4]
    }:00+08:00`;
  } else {
    formattedDateString = `${formattedDateString} 00:00:00+08:00`;
  }
  return new Date(Date.parse(formattedDateString));
}

/**
 * Parse amount from string to int
 *
 * Input: "3,000,000元"
 * Output: 3000000
 */
function parseAmountToInt(amount) {
  // remove "," and "\u5143"("元")
  return parseInt(amount.replace(/[,\u5143]/g, ""));
}

/**
 * Input: address string
 * Output: OCDS address object
 */
function parseAddressToOcdsAddress(addressString) {
  if (addressString == null) {
    return null;
  }
  let ocdsAddress = {
    countryName: "臺灣",
    streetAddress: addressString
  };
  // get county name
  const countyLastCharIndex =
    addressString.indexOf("市") || addressString.indexOf("縣");
  if (countyLastCharIndex >= 0) {
    ocdsAddress["locality"] = addressString.substring(
      countyLastCharIndex - 2,
      countyLastCharIndex + 1
    );
  } else {
    console.error(
      `county name is not found in address string ${addressString}`
    );
  }

  // get district name (I think this part would be kind of flaky)
  const districtLastCharIndex = addressString.indexOf("區");
  if (districtLastCharIndex >= 0) {
    ocdsAddress["region"] = addressString.substring(
      districtLastCharIndex - 2,
      districtLastCharIndex + 1
    );
  } else {
    console.error(
      `district name is not found in address string ${addressString}`
    );
  }

  // get postal code from the front by checking for the first non numerical
  // number (has not been thoroughly tested yet)
  const match = /[^0-9]/.exec(addressString);
  if (
    match != null &&
    match.index < 5 /* The most detailed postal code in TW is len of 5 */
  ) {
    ocdsAddress["postalCode"] = addressString.substring(0, match.index);
  } else {
    console.error(`postalCode is not found in address string ${addressString}`);
  }
  return ocdsAddress;
}

/*
 *
 * Given a Zh string of file type (決標公告), we return a tag from
 * the tag codelist.
 * https://standard.open-contracting.org/latest/en/schema/codelists/#release-tag
 *
 */
function getReleaseTagFromZhString(typeString) {
  switch (typeString) {
    case "招標文件公開閱覽公告資料公告":
      return "planning";
    case "公開取得報價單或企劃書公告":
    case "公開取得報價單或企劃書更正公告":
    case "公開招標公告":
    case "限制性招標(經公開評選或公開徵求)公告":
      return "tender";
    case "公開招標更正公告":
    case "限制性招標(經公開評選或公開徵求)更正公告":
    case "招標文件公開閱覽公告資料更正公告":
    case "無法決標公告":
    case "更正無法決標公告":
      return "tenderUpdate";
    case "決標公告":
    case "定期彙送":
      return "award";
    case "更正決標公告":
    case "更正定期彙送":
    case "拒絕往來廠商名單公告":
      return "awardUpdate";
    default:
      throw `type: ${typeString} does not have a mapping tag.`;
  }
}

/*
 *
 * Given a Zh string of category (財物類381-傢具), we return a procurement category from
 * the procurementCategory codelist.
 * https://standard.open-contracting.org/latest/en/schema/codelists/#procurement-category
 *
 * According to the law listed here
 * https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030057
 * Seems like there's only three options in Taiwan
 * 工程
 * 財物
 * 勞務
 *
 */
function getProcurementCategory(categoryString) {
  if (categoryString.indexOf("工程") >= 0) {
    return "works";
  }
  if (categoryString.indexOf("財物") >= 0) {
    return "goods";
  }
  if (categoryString.indexOf("勞務") >= 0) {
    return "services";
  }

  console.error(
    `procurement category: ${categoryString} is not given a category code.`
  );
}

/*
 * Given Zh String, return a method codeList
 * https://standard.open-contracting.org/latest/en/schema/codelists/#method
 */
function getProcurementMethod(methodString) {
  switch (methodString) {
    case "公開招標":
    case "公開取得報價單或企劃書":
      return "open";
    case "選擇性招標(建立合格廠商名單)":
      return "selective";
    case "限制性招標(經公開評選或公開徵求)":
    case "限制性招標(未經公開評選或公開徵求)":
      return "limited";
    // TODO: Fill in these data
    case "!":
      return "direct";
    default:
      throw `${methodString} does not have a mapping method code.`;
  }
}

// https://standard.open-contracting.org/latest/en/schema/codelists/#award-status
function getAwardStatusFromFailedTenderStatus(failedTenderstatus) {
  if (
    failedTenderstatus === "廢標" ||
    // Example: unit_id=3.79&job_number=1060405C0033&date=20170602&filename=NAI-1-52150840
    failedTenderstatus.indexOf("不予開標決標") >= 0
  ) {
    return "cancelled";
  }
  if (failedTenderstatus.indexOf("流標") >= 0) {
    return "unsuccessful";
  }
  console.log(failedTenderstatus);
  throw `failed tender status: ${failedTenderstatus} is not covered`;
}

// Same as the previous function
// https://standard.open-contracting.org/latest/en/schema/codelists/#tender-status
function getTenderStatusFromOngoingTenderStatus(ongoingTenderStatus) {
  if (
    ongoingTenderStatus.indexOf("公開招標") >= 0 ||
    ongoingTenderStatus.indexOf("公開取得") >= 0 ||
    ongoingTenderStatus.indexOf("限制性招標") >= 0
  ) {
    return "active";
  }

  throw `ongoing tender status: ${ongoingTenderStatus} is not covered`;
}

function postProcessing(ocdsRelease) {
  // Due to the constraint where we only set the awards.id, awards.title and awards.date into
  // the first element while parsing the query results, we need to
  // copy all the mentioned awards data in first object to the other awards in the array
  // const { awards } = ocdsRelease;
  // if (awards != null && awards.length > 1) {
  //   const { items: _items, suppliers: _suppliers, ...otherFields } = awards[0];
  //   for (let i = 1; i < awards.length; i++) {
  //     ocdsRelease.awards[i] = { ...ocdsRelease.awards[i], ...otherFields };
  //   }
  // }

  return ocdsRelease;
}

const writeJsonFile = function(path, data) {
  fs.writeFile(path, JSON.stringify(data, null, 4), err => {
    if (err) {
      throw err;
    }
    console.log("JSON data is saved.");
  });
};

const initPackage = function(ocid) {
  releasePackage = {};
  releasePackage.uri = `ocds://contract/${ocid}`;
  releasePackage.publishedDate = new Date().toISOString();
  releasePackage.publisher = {
    name: "Learning Man"
  };
  releasePackage.version = "1.1";
  releasePackage.extensions = [
    "https://raw.githubusercontent.com/open-contracting-extensions/ocds_participationFee_extension/v1.1.4/extension.json",
    "https://raw.githubusercontent.com/open-contracting-extensions/ocds_location_extension/v1.1.4/extension.json",
    "https://raw.githubusercontent.com/open-contracting-extensions/ocds_legalBasis_extension/master/extension.json",
    "https://raw.githubusercontent.com/open-contracting-extensions/ocds_coveredBy_extension/master/extension.json",
    "https://raw.githubusercontent.com/open-contracting-extensions/ocds_otherRequirements_extension/master/extension.json",
    "https://raw.githubusercontent.com/luffykai/ocds-tw-extension/master/extension.json",
  ];
  releasePackage.releases = [];
  return releasePackage;
};

const outputPackage = function(releasePackage) {
  uri = new URL(releasePackage.uri);
  writeJsonFile(`output/${uri.pathname}`, releasePackage);
};

const printProjectHeader = function(project, regex) {
  console.log(`\n\x1b[32m[ ${project.pid} ]\x1b[36m`);
  console.log(`  * title: ${project.title}`);
  console.log(`  * county: ${project.county}`);
  console.log(`  * uids: ${project.uid}`);
  console.log(`  * regex: ${regex}`);
  console.log(`  * Firebase URL: https://console.firebase.google.com/u/0/project/lm-ph2020/database/firestore/data~2Fcounties~2F${project.county}~2Fprojects~2F${project.pid.hash()}\x1b[0m\n`);
};


/*
 * Load the csv file and turn it into a Map Object
 * synchronously
 */
const loadMap = function (type) {
  let filePath = "data/field_map.csv";
  if(type === 'award') {
    filePath = 'data/award_field_map.csv';
  }
  const map = new Map();
  data = fs.readFileSync(filePath);
  const records = csvparse(data, {
    columns: true,
    skip_empty_lines: true,
  });

  for (record of records) {
    map.set(record.ronny_field, record.ocds_path);
  }

  return map;
};

const getStringAfterColon = function(s) {
  // Remove the first part before colon
  // A:B:C  --> B:C
  let i = s.indexOf(":");
  if (i < 0) {
    return s;
  }
  return s.substring(i+1);
}

module.exports = {
  ALREADY_IMPLIED_FIELDS,
  NON_MAPPING_FIELDS,
  getAwardStatusFromFailedTenderStatus,
  getTenderStatusFromOngoingTenderStatus,
  getProcurementCategory,
  getProcurementMethod,
  getReleaseTagFromZhString,
  loadMap,
  parseTaiwaneseDateStringToDate,
  parseReleaesDateStringToIsoString,
  parseAddressToOcdsAddress,
  parseAmountToInt,
  postProcessing,
  printProjectHeader,
  initPackage,
  outputPackage,
  getStringAfterColon,
  writeJsonFile
};
