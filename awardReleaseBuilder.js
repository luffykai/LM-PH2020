const put = require("./put.js");

const regexSupplierName = /^決標品項:第(\d)品項:得標廠商(\d):得標廠商$/;

function getNextUnusedIndex(array) {
  return array != null ? array.length : 0;
}

// Path in this mapping is relative to "awards".
const initializingFields = {
  date: "決標資料:決標日期",
  id: "已公告資料:標案案號",
  title: "已公告資料:標案名稱"
};

function initiateAwardForSupplier(supplierName, releaseDetail, ocdsRelease) {
  let supplierIdx = getNextUnusedIndex(ocdsRelease.awards);
  // awards might be just initiated, so awards[0] will created an array.
  put(ocdsRelease, `awards[${supplierIdx}].suppliers[0].id`, supplierName);
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
}

const awardReleaseBuilder = {
  build: (releaseDetail, ocdsRelease) => {
    const supplierMap = new Map();
    for (let key in releaseDetail) {
      const value = releaseDetail[key];
      let match = key.match(regexSupplierName);
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
  }
};

module.exports = awardReleaseBuilder;
