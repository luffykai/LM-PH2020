const put = require("./put.js");

const regexSupplierName = /^決標品項:第(\d)品項:得標廠商(\d):得標廠商$/;

function getNextUnusedIndex(array) {
  return array != null ? array.length : 0;
}

function initiateAwardForSupplier(supplierName, releaseDetail, ocdsRelease) {
  let supplierIdx = getNextUnusedIndex(ocdsRelease.awards);
  // We don't really have an id for suppliers, falling back to
  // its name string.
  put(ocdsRelease, `awards[${supplierIdx}].suppliers[0].id`, supplierName);
  put(
    ocdsRelease,
    `awards[${supplierIdx}].id`,
    releaseDetail["已公告資料:標案案號"]
  );
  put(
    ocdsRelease,
    `awards[${supplierIdx}].title`,
    releaseDetail["已公告資料:標案名稱"]
  );
  put(
    ocdsRelease,
    `awards[${supplierIdx}].date`,
    releaseDetail["已公告資料:開標時間"]
  );
  return supplierIdx;
}

function populateItemInSupplierAward(
  match,
  supplierIdx,
  releaseDetail,
  ocdsRelease
) {
  const itemIdx = getNextUnusedIndex(ocdsRelease.awards[supplierIdx].items);
  put(
    ocdsRelease,
    `awards[${supplierIdx}].items[${itemIdx}].id`,
    releaseDetail[`決標品項:第${match[1]}品項:品項名稱`]
  );
  put(
    ocdsRelease,
    `awards[${supplierIdx}].items[${itemIdx}].quantity`,
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
        supplierIdx,
        releaseDetail,
        ocdsRelease
      );
    }
  }
};

module.exports = awardReleaseBuilder;
