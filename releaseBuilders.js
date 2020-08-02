const awardReleaseBuilder = require("./awardReleaseBuilder");
const genericReleaseBuilder = require("./genericReleaseBuilder.js");

function getReleaseBuilder(releaseTag) {
  switch (releaseTag) {
    case "award":
      return awardReleaseBuilder;
    default:
      return genericReleaseBuilder;
  }
}

module.exports = getReleaseBuilder;