// This file contains a mapping of ronny field to it's special handler to
// do extra processing to the data so that it matches ocds requirement
// It might also handle cases where one field contains information of multiple
// ocds fields.

const put = require("./put.js");
const {
  parseAddressToOcdsAddress,
  parseAmountToInt,
  parseTaiwaneseDateStringToDate,
  getAwardStatusFromFailedTenderStatus,
  getTenderStatusFromOngoingTenderStatus,
  getProcurementCategory,
  getProcurementMethod
} = require("./LMUtils");

const fieldHandlers = {
  "招標方式": (value, _ocdsRelease) => {
    put(_ocdsRelease, "tender.procurementMethod", getProcurementMethod(value));
    return null;
  },
  "招標資料:招標狀態": (value, _ocdsRelease) => {
    return getTenderStatusFromOngoingTenderStatus(value);
  },
  "無法決標公告:無法決標的理由": (value, ocdsRelease) => {
    const awardStatus = getAwardStatusFromFailedTenderStatus(value);
    put(ocdsRelease, "tender.status", "unsuccessful");
    put(ocdsRelease, "awards[0]", {
      id: `${ocdsRelease["id"]}-awards-0`,
      status: awardStatus
    });
    return null;
  },
  "機關資料:機關代碼": (value, ocdsRelease) => {
    put(ocdsRelease, "parties[0].id", value);
    put(ocdsRelease, "parties[0].roles[]", "buyer");
    return value;
  },
  "無法決標公告:機關代碼": (value, ocdsRelease) => {
    put(ocdsRelease, "parties[0].id", value);
    return value;
  },
  "機關資料:機關名稱": (value, ocdsRelease) => {
    put(ocdsRelease, "parties[0].name", value);
    return value;
  },
  "無法決標公告:機關名稱": (value, ocdsRelease) => {
    put(ocdsRelease, "parties[0].name", value);
    return value;
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
  "無法決標公告:標的分類": (value, _ocdsRelease) => {
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
    put(_ocdsRelease, "tender.value", {
      currency: "TWD", amount: parseAmountToInt(value)
    });
  },
  "已公告資料:預算金額": (value, _ocdsRelease) => {
    if (value == null) {
      return null;
    }
    put(_ocdsRelease, "tender.value", {
      currency: "TWD", amount: parseAmountToInt(value)
    });
  },
  "標案內容:預算金額": (value, _ocdsRelease) => {
    if (value == null) {
      return null;
    }
    put(_ocdsRelease, "tender.value", {
      currency: "TWD", amount: parseAmountToInt(value)
    });
  },
  "領投開標:是否提供電子領標:總計": (value, _ocdsRelease) => {
    if (value == null) {
      return null;
    }
    put(_ocdsRelease, "tender.participationFees[]", {
      description: "total",
      value: { currency: "TWD", amount: parseAmountToInt(value) }
    })
  },
  "領投開標:是否提供電子領標:機關文件費(機關實收)": (value, _ocdsRelease) => {
    if (value == null) {
      return null;
    }
    put(_ocdsRelease, "tender.participationFees[]", {
      description: "document fee for organization",
      value: { currency: "TWD", amount: parseAmountToInt(value) }
    })
  },
  "領投開標:是否提供電子領標:系統使用費": (value, _ocdsRelease) => {
    if (value == null) {
      return null;
    }
    put(_ocdsRelease, "tender.participationFees[]", {
      description: "system usage",
      value: { currency: "TWD", amount: parseAmountToInt(value) }
    })
  },
  "領投開標:是否提供電子領標:文件代收費": (value, _ocdsRelease) => {
    if (value == null) {
      return null;
    }
    put(_ocdsRelease, "tender.participationFees[]", {
      description: "document",
      value: { currency: "TWD", amount: parseAmountToInt(value) }
    })
  },
  "決標資料:總決標金額":(value, _ocdsRelease) => {
    put(_ocdsRelease, "award", {
      value: { currency: "TWD", amount: parseAmountToInt(value) }
    })
  },
  "履約地點": (value, ocdsRelease) => {
    return {
      id: ocdsRelease.tender.title,
      deliveryAddress: { streetAddress: value }
    };
  },
  "招標資料:公告日": (value, _ocdsRelease) => {
    const date = parseTaiwaneseDateStringToDate(value);
    return date ? date.toISOString() : null;
  },
  "領投開標:截止投標": (value, _ocdsRelease) => {
    const date = parseTaiwaneseDateStringToDate(value);
    return date ? date.toISOString() : null;
  },
  "領投開標:開標時間": (value, _ocdsRelease) => {
    let date = parseTaiwaneseDateStringToDate(value);
    date.setDate(date.getDate() + 1);
    return date ? date.toISOString() : null;
  },
  "其他:履約期限": (value, _ocdsRelease, releaseDetail) => {
    const startDate = fieldHandlers["領投開標:開標時間"](
      releaseDetail["領投開標:開標時間"],
      _ocdsRelease
    );
    const parsedNumOfDays = value.match(/\d+/g);
    if (
      parsedNumOfDays == null ||
      parsedNumOfDays.length == 0 ||
      parseInt(parsedNumOfDays[0]) == null ||
      startDate == null
    ) {
      return null;
    }
    // TODO: this assumes the first number is number of days.
    let date = new Date(startDate);
    date.setDate(date.getDate() + parseInt(parsedNumOfDays[0]));
    return date.toISOString();
  },
  "是否適用條約或協定之採購:是否適用WTO政府採購協定(GPA)": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.coveredBy[]", "GPA");
    }
    return null;
  },
  "是否適用條約或協定之採購:是否適用臺紐經濟合作協定(ANZTEC)": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.coveredBy[]", "ANZTEC");
    }
    return null;
  },
  "是否適用條約或協定之採購:是否適用臺星經濟夥伴協定(ASTEP)": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.coveredBy[]", "ASTEP");
    }
    return null;
  },
  "招標資料:是否適用採購法第104條或105條或招標期限標準第10條或第4條之1": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.coveredBy[]", "採購法第104條或105條或招標期限標準第10條或第4條之1");
    }
    return null;
  },
  "是否依據採購法第106條第1項第1款辦理": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.coveredBy[]", "採購法第106條第1項第1款");
    }
    return null;
  },
  "其他:是否依據採購法第99條": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.coveredBy[]", "採購法第99條");
    }
    return null;
  },
  "其他:是否訂有與履約能力有關之基本資格": (
    value,
    ocdsRelease
  ) => {
    // do nothing, will do take care by the below ones
    return null;
  },
  "其他:是否訂有與履約能力有關之基本資格:廠商應附具之基本資格證明文件或物品": (
    value,
    ocdsRelease
  ) => {
    put(ocdsRelease, "tender.otherRequirements.qualificationSystemConditions[]", value);
    return null;
  },
  "其他:是否訂有與履約能力有關之特定資格": (
    value,
    ocdsRelease
  ) => {
    // do nothing, will do take care by the below ones
    return null;
  },
  "是否含特別預算": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.withSpecialBudget", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.withSpecialBudget", false);
    }
    return null;
  },
  "本採購是否屬「涉及國家安全」採購": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.involveNationalSecurity", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.involveNationalSecurity", false);
    }
    return null;
  },
  "本採購是否屬「具敏感性或國安(含資安)疑慮之業務範疇」採購": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.involveInfoSecurityOrNationalSecurity", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.involveInfoSecurityOrNationalSecurity", false);
    }
    return null;
  },
  "是否刊登公報": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.publishedOnWebsite", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.publishedOnWebsite", false);
    }
    return null;
  },
  "是否屬統包": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.isTurnkeyProcurement", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.isTurnkeyProcurement", false);
    }
    return null;
  },
  "是否屬災區重建工程": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.isReconstructionArea", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.isReconstructionArea", false);
    }
    return null;
  },
  "是否屬二以上機關之聯合採購(不適用共同供應契約規定)": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.involvesMultipleBuyingOrganization", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.involvesMultipleBuyingOrganization", false);
    }
    return null;
  },
  "是否屬特殊採購": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.isSpecialProcurement", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.isSpecialProcurement", false);
    }
    return null;
  },
  "是否受機關補助": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.isSponsoredByOrganization", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.isSponsoredByOrganization", false);
    }
    return null;
  },
  "是否複數決標": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.multipleAward", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.multipleAward", false);
    }
    return null;
  },
  "是否屬共同供應契約採購": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.procureForMultipleOrganization", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.procureForMultipleOrganization", false);
    }
    return null;
  },
  "是否提供電子領標": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.allowOnlineTender", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.allowOnlineTender", false);
    }
    return null;
  },
  "是否提供電子領標:是否提供現場領標": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.allowInPersonTender", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.allowInPersonTender", false);
    }
    return null;
  },
  "預算金額是否公開": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.isBudgetDisclosed", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.isBudgetDisclosed", false);
    }
    return null;
  },
  "是否共同投標": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.allowCoBid", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.allowCoBid", false);
    }
    return null;
  },
  "是否須繳納押標金": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.requireBidDeposit", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.requireBidDeposit", false);
    }
    return null;
  },
  "是否訂有底價": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.minimumValueExists", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.minimumValueExists", false);
    }
    return null;
  },
  "是否為商業財物或服務": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.isBusinessProductOrService", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.isBusinessProductOrService", false);
    }
    return null;
  },
  "是否採用電子競價": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.useEBidding", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.useEBidding", false);
    }
    return null;
  },
  "價格是否納入評選": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.evaluateOnValue", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.evaluateOnValue", false);
    }
    return null;
  },
  "是否採行協商措施": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.requireNegotiation", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.requireNegotiation", false);
    }
    return null;
  },
  "本案採購契約是否採用主管機關訂定之範本": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.useProvidedContractTemplate", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.useProvidedContractTemplate", false);
    }
    return null;
  },
  "後續擴充": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.hasFollowupProcurement", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.hasFollowupProcurement", false);
    }
    return null;
  },
  "是否刊登英文公告": (
    value,
    ocdsRelease
  ) => {
    if (value === "是") {
      put(ocdsRelease, "tender.additionalProperties.hasEnglishVersion", true);
    } else {
      put(ocdsRelease, "tender.additionalProperties.hasEnglishVersion", false);
    }
    return null;
  },
  "投標廠商家數": (
    value,
    ocdsRelease
  ) => {
    put(ocdsRelease, "tender.numberOfTenderers", parseInt(value))
  },
  "其他:是否訂有與履約能力有關之特定資格:廠商應附具之特定資格證明文件": (
    value,
    ocdsRelease
  ) => {
    put(ocdsRelease, "tender.otherRequirements.qualificationSystemConditions[]", value);
    return null;
  }
};

module.exports = fieldHandlers;
