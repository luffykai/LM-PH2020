/*
 * Input: 舊宗
 * Output: \u820A\u5B97
 * Escaping unicode for chinese characters.
 */
function escapeUnicode(str) {
  return escape(str).replace(/\%u/g, '\\u');
}

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
        return 'planning';
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

module.exports = {
  getReleaseTagFromZhString,
  getTimestampWithDateString,
  escapeUnicode
};
