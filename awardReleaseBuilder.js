const put = require("./put.js");

const regexSupplierName = /^決標品項:第(\d)品項:得標廠商(\d):得標廠商$/;

function getNextUnusedIndex(array) {
  return array != null ? array.length : 0;
}

const awardReleaseBuilder = {
  build: (releaseDetail, ocdsRelease) => {
    const supplierMap = new Map();
    for (let key in releaseDetail) {
      const value = releaseDetail[key];
      let match = null;
      if ((match = key.match(regexSupplierName))) {
        let supplierIdx = supplierMap.get(value);
        if (supplierIdx == null) {
          supplierIdx = getNextUnusedIndex(ocdsRelease.awards);
          supplierMap.set(value, supplierIdx);
          put(ocdsRelease, `awards[${supplierIdx}].suppliers[0].id`, value);
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
        }
        const itemIdx = getNextUnusedIndex(
          ocdsRelease.awards[supplierIdx].items
        );
        put(
          ocdsRelease,
          `awards[${supplierIdx}].items[${itemIdx}].id`,
          releaseDetail[`決標品項:第${match[1]}品項:品項名稱`]
        );
        put(
          ocdsRelease,
          `awards[${supplierIdx}].items[${itemIdx}].quantity`,
          releaseDetail[
            `決標品項:第${match[1]}品項:得標廠商${match[2]}:預估需求數量`
          ]
        );
      }
    }
  }
};

module.exports = awardReleaseBuilder;
