/*
 * Input: 20200708
 * Output: 1594080000000
 * This is a Utils to set timestamp for each releases
 */
function getTimestampWithDateString(dateString) {
  if (dateString == null || dateString === "") {
    return null;
  }

  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6);
  const releaseDate = Date.parse(`${year}-${month}-${day}`);

  return releaseDate.toString();
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
    case "公開招標公告":
    case "限制性招標(經公開評選或公開徵求)公告":
      return "tender";
    case "公開招標更正公告":
    case "限制性招標(經公開評選或公開徵求)更正公告":
    case "招標文件公開閱覽公告資料更正公告":
      return "tenderUpdate";
    case "決標公告":
      return "award";
    case "更正決標公告":
    case "無法決標公告": // This I'm not so sure about this one.
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
  if (failedTenderstatus === "廢標") {
    return "cancelled";
  }
  if (failedTenderstatus.indexOf("流標") >= 0) {
    return "unsuccessful";
  }

  throw `failed tender status: ${failedTenderStatus} is not covered`;
}

function postProcessing(ocdsRelease) {
  // Due to the constraint where we only set the awards.id, awards.title and awards.date into
  // the first element while parsing the query results, we need to
  // copy all the mentioned awards data in first object to the other awards in the array
  const { awards } = ocdsRelease;
  if (awards != null && awards.length > 1) {
    const { items: _items, suppliers: _suppliers, ...otherFields } = awards[0];
    for (let i = 1; i < awards.length; i++) {
      ocdsRelease.awards[i] = { ...ocdsRelease.awards[i], ...otherFields };
    }
  }

  return ocdsRelease;
}

module.exports = {
  getAwardStatusFromFailedTenderStatus,
  getProcurementCategory,
  getProcurementMethod,
  getReleaseTagFromZhString,
  getTimestampWithDateString,
  postProcessing,
};
