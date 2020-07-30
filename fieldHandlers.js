// This file contains a mapping of ronny field to it's special handler to
// do extra processing to the data so that it matches ocds requirement

const fieldHandlers = {
    /*
     * Given Zh String, return a method codeList
     * https://standard.open-contracting.org/latest/en/schema/codelists/#method
     */
    "招標資料:招標方式": (value) => {
    switch (value) {
      case "公開招標":
        return "open";
      // TODO: Fill in these data
      case "":
        return "selective";
      case "?":
        return "limited";
      case "!":
        return "direct";
      default:
        throw `${value} does not have a mapping method code.`
    }
  },
};

module.exports = fieldHandlers;
