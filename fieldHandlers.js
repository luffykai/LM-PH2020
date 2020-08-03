// This file contains a mapping of ronny field to it's special handler to
// do extra processing to the data so that it matches ocds requirement
// It might also handle cases where one field contains information of multiple
// ocds fields.

const put = require("./put.js");
const {
  parseAddressToOcdsAddress,
  parseAmountToInt,
  parseTaiwaneseDateStringToIsoString,
  getAwardStatusFromFailedTenderStatus,
  getProcurementCategory,
  getProcurementMethod
} = require("./LMUtils");

const fieldHandlers = {
  "招標資料:招標方式": (value, _ocdsRelease) => {
    return getProcurementMethod(value);
  },
  "無法決標公告:招標方式": (value, _ocdsRelease) => {
    return getProcurementMethod(value);
  },
  "無法決標公告:無法決標的理由": (value, ocdsRelease) => {
    const awardStatus = getAwardStatusFromFailedTenderStatus(value);
    put(ocdsRelease, "awards[0]", {
      id: `${ocdsRelease["id"]}-awards-0`,
      status: awardStatus
    });
    return null;
  },
  // Extract detail address information fields
  "機關資料:機關地址": (addressString, ocdsRelease) => {
    put(
      ocdsRelease,
      "parties[].address",
      parseAddressToOcdsAddress(addressString)
    );
    return addressString;
  },
  "採購資料:標的分類": (value, _ocdsRelease) => {
    return getProcurementCategory(value);
  },
  // for fields with only derivation value, we return null.
  // https://standard.open-contracting.org/latest/en/schema/codelists/#submission-method
  "領投開標:是否提供電子投標": (value, ocdsRelease) => {
    if (value === "是") {
      put(ocdsRelease, "tender.submissionMethod[]", "electronicSubmission");
    }

    return null;
  },
  // for fields with only derivation value, we return null.
  // https://standard.open-contracting.org/latest/en/schema/codelists/#submission-method
  "領投開標:收受投標文件地點": (value, ocdsRelease) => {
    if (value.indexOf("親送或") >= 0) {
      put(ocdsRelease, "tender.submissionMethod[]", "written");
    } else if (value.indexOf("親送") >= 0) {
      put(ocdsRelease, "tender.submissionMethod[]", "inPerson");
    }

    return value;
  },
  "採購資料:預算金額": (value, _ocdsRelease) => {
    if (value == null) {
      return null;
    }
    return { currency: "TWD", amount: parseAmountToInt(value) };
  },
  "領投開標:是否提供電子領標:總計": (value, _ocdsRelease) => {
    if (value == null) {
      return null;
    }
    return {
      value: { currency: "TWD", amount: parseAmountToInt(value) }
    };
  },
  "其他:履約地點": (value, ocdsRelease) => {
    return {
      id: ocdsRelease.tender.title,
      deliveryAddress: { streetAddress: value }
    };
  },
  "招標資料:公告日": (value, _ocdsRelease) => {
    return parseTaiwaneseDateStringToIsoString(value);
  },
  "領投開標:截止投標": (value, _ocdsRelease) => {
    return parseTaiwaneseDateStringToIsoString(value);
  }
};

module.exports = fieldHandlers;
