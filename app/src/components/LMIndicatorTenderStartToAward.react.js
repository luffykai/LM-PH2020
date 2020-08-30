import React from "react";
import LMIndicatorSection from "./LMIndicatorSection.react";
import LMOCDSIndicatorUtils from "../javascripts/utils/LMOCDSIndicatorUtils";

const METRIC_DESCRIPTION = `Longer time delays between phases of the contracting process can
 signal inefficiency in the contracting process.`;

const DEFINITION_IMAGE = <img src="images/start_award.png" />;

export default function LMIndicatorTenderStartToAward({ fullData, id }) {
  let completedTenderCount = 0;
  let durationCount = 0;

  for (let countyKey in fullData) {
    const countyData = fullData[countyKey];
    for (let oc4idsDataOfAProject of countyData.projects) {
      const {
        completedTenderCount: _completedTenderCount,
        durationCount: _durationCount,
      } = LMOCDSIndicatorUtils.getTenderDurationAndCompletedTenderCountFromOC4IDs(
        oc4idsDataOfAProject
      );
      completedTenderCount += _completedTenderCount;
      durationCount += _durationCount;
    }
  }

  const indicator = parseFloat(durationCount / completedTenderCount).toFixed(2);

  return (
    <LMIndicatorSection
      definition={DEFINITION_IMAGE}
      description={METRIC_DESCRIPTION}
      id={id}
      indicator={indicator}
      indicatorSuffix="days from tender start to award decision"
    />
  );
}
