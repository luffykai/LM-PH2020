import React from "react";
import LMIndicatorSection from "./LMIndicatorSection.react";
import LMOCDSIndicatorUtils from "../javascripts/utils/LMOCDSIndicatorUtils";

const METRIC_DESCRIPTION = `A higher median number of bidders per tender
may indicate limited sole-sourcing and that tenders fairer competition.
It may indicate increased competition and trust in the contracting system.`;

const startYear = 2013;

export default function LMIndicatorMedianBidder({ fullData }) {
  let bidderCountArray = [];
  for (let countyKey in fullData) {
    const countyData = fullData[countyKey];
    for (let oc4idsDataOfAProject of countyData.projects) {
      const _bidderCountArray = LMOCDSIndicatorUtils.getBidderCountArrayFromOC4IDs(
        oc4idsDataOfAProject
      );

      bidderCountArray = bidderCountArray.concat(_bidderCountArray);
    }
  }

  // sort it
  bidderCountArray = bidderCountArray.sort((a, b) => a - b);
  console.log("bidderCountArray", bidderCountArray);
  const lowerMedian = bidderCountArray[Math.floor(bidderCountArray.length) / 2];
  const upperMedian = bidderCountArray[Math.ceil(bidderCountArray.length / 2)];

  const median = parseFloat((lowerMedian + upperMedian) / 2).toFixed(2);

  return (
    <LMIndicatorSection
      description={METRIC_DESCRIPTION}
      indicator={median}
      indicatorSuffix="median # of bidders"
    />
  );
}
