const { parseAmountToInt } = require("./LMUtils");
const put = require("./put.js");

const regexSupplierName = /^決標品項:第(\d)品項:得標廠商(\d):得標廠商$/;

function getNextUnusedIndex(array) {
  return array != null ? array.length : 0;
}

// Returns the unit price rounded to an int.
function getUnitValueAmount(totalAmount, unit) {
  return parseInt((parseAmountToInt(totalAmount) / parseFloat(unit)));
}

// Path in this mapping is relative to "awards".
const initializingFields = {
  date: "決標資料:決標日期",
  id: "已公告資料:標案案號",
  title: "已公告資料:標案名稱"
};

function initiateAwardForSupplier(supplierName, releaseDetail, ocdsRelease) {
  let supplierIdx = getNextUnusedIndex(ocdsRelease.awards);
  // The award might be just initiated, so awards[0] will created an array here.
  put(ocdsRelease, `awards[${supplierIdx}].suppliers[0].id`, supplierName);
  put(ocdsRelease.awards[supplierIdx], "status", "active");
  for (let key in initializingFields) {
    put(
      ocdsRelease.awards[supplierIdx],
      key,
      releaseDetail[initializingFields[key]]
    );
  }
  return supplierIdx;
}

function populateItemInSupplierAward(match, releaseDetail, award) {
  const itemIdx = getNextUnusedIndex(award.items);
  put(
    award,
    `items[${itemIdx}].id`,
    releaseDetail[`決標品項:第${match[1]}品項:品項名稱`]
  );
  put(
    award,
    `items[${itemIdx}].quantity`,
    releaseDetail[`決標品項:第${match[1]}品項:得標廠商${match[2]}:預估需求數量`]
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

function populatePartiesInSupplierAward(releaseDetail, ocdsRelease) {
  const committeeField = releaseDetail["最有利標:評選委員"];
  if (!Array.isArray(committeeField) || committeeField.length == 0) {
    return;
  }

  for (let committeeMember of committeeField[0]) {
    put(ocdsRelease, "parties[]", {
      name: committeeMember["姓名"],
      roles: ["reviewBody"],
      details: {
        occupation: committeeMember["職業"],
        hasAttendedMeeting: committeeMember["出席會議"] === "是" ? true : false
      }
    });
  }
}

const awardReleaseBuilder = {
  build: (releaseDetail, ocdsRelease) => {
    const supplierMap = new Map();
    for (let key in releaseDetail) {
      const value = releaseDetail[key];
      const match = key.match(regexSupplierName);
      if (match == null) {
        continue;
      }
      let supplierIdx = supplierMap.get(value);
      if (supplierIdx == null) {
        supplierIdx = initiateAwardForSupplier(
          value,
          releaseDetail,
          ocdsRelease
        );
        supplierMap.set(value, supplierIdx);
      }
      populateItemInSupplierAward(
        match,
        releaseDetail,
        ocdsRelease.awards[supplierIdx]
      );
    }

    populatePartiesInSupplierAward(releaseDetail, ocdsRelease);
  }
};

module.exports = awardReleaseBuilder;
