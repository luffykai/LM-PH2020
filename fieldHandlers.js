// This file contains a mapping of ronny field to it's special handler to
// do extra processing to the data so that it matches ocds requirement
// It might also handle cases where one field contains information of multiple
// ocds fields.

const put = require("./put.js");
const { getProcurementCategory } = require("./LMUtils");

const fieldHandlers = {
  /*
   * Given Zh String, return a method codeList
   * https://standard.open-contracting.org/latest/en/schema/codelists/#method
   */
  "招標資料:招標方式": (value, _ocdsRelease) => {
    switch (value) {
      case "公開招標":
        return "open";
      case "選擇性招標(建立合格廠商名單)":
        return "selective";
      case "限制性招標(經公開評選或公開徵求)":
        return "limited";
      // TODO: Fill in these data
      case "!":
        return "direct";
      default:
        throw `${value} does not have a mapping method code.`;
    }
  },
  // Extract detail address information fields
  "機關資料:機關地址": (addressString, ocdsRelease) => {
    // get county name
    const countyLastCharIndex =
      addressString.indexOf("市") || addressString.indexOf("縣");
    if (countyLastCharIndex >= 0) {
      const countyName = addressString.substring(
        countyLastCharIndex - 2,
        countyLastCharIndex + 1
      );
      put(ocdsRelease, "parties.address.locality", countyName);
    } else {
      console.error(
        `county name is not found in address string ${addressString}`
      );
    }

    // get district name (I think this part would be kind of flaky)
    const districtLastCharIndex = addressString.indexOf("區");
    if (districtLastCharIndex >= 0) {
      const districtName = addressString.substring(
        districtLastCharIndex - 2,
        districtLastCharIndex + 1
      );
      put(ocdsRelease, "parties.address.region", districtName);
    } else {
      console.error(
        `district name is not found in address string ${addressString}`
      );
    }

    // get postal code from the front by checking for the first non numerica number
    // (has not been thoroughly tested yet)
    const match = /[^0-9]/.exec(addressString);
    if (
      match != null &&
      match.index < 5 /* The most detailed postal code in TW is len of 5 */
    ) {
      const postalCode = addressString.substring(0, match.index);
      put(ocdsRelease, "parties.address.postalCode", postalCode);
    } else {
      console.error(
        `postalCode is not found in address string ${addressString}`
      );
    }

    // Hardcode country name
    put(ocdsRelease, "parties.address.countryName", "臺灣");

    return addressString;
  },
  "採購資料:標的分類": (value, _ocdsRelease) => {
    return getProcurementCategory(value);
  },
};

module.exports = fieldHandlers;
