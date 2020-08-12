const awardReleaseBuilder = require("./awardReleaseBuilder");
const genericReleaseBuilder = require("./genericReleaseBuilder.js");

function getReleaseBuilder(releaseTag) {
  switch (releaseTag) {
    case "award":
    case "awardUpdate":
      return awardReleaseBuilder;
    default:
      return genericReleaseBuilder;
  }
}

module.exports = getReleaseBuilder;