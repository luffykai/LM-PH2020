import React from "react";
import LMIndicatorSection from "./LMIndicatorSection.react";
import LMOCDSIndicatorUtils from "../javascripts/utils/LMOCDSIndicatorUtils";

const METRIC_DESCRIPTION = `A higher median number of bidders per tender
may indicate limited sole-sourcing and that tenders fairer competition.
It may indicate increased competition and trust in the contracting system.`;

// Create an Array of int from 2010 to 2019.
const YEARS = Array.from(Array(10), (_, i) => i + 2010);

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

  const median = LMOCDSIndicatorUtils.getMedianFromArray(bidderCountArray);
  // Initialize this map
  const yearDataMap = Object.create(null);
  for (let year of YEARS) {
    yearDataMap[year] = [];
  }

  for (let countyKey in fullData) {
    const countyData = fullData[countyKey];
    for (let oc4idsDataOfAProject of countyData.projects) {
      const _bidderCountMap = LMOCDSIndicatorUtils.getBidderCountArrayInMapFromOC4IDs(
        oc4idsDataOfAProject
      );

      for (let year in _bidderCountMap) {
        // Only Collect the years that's listed in the header of this file.
        if (year in yearDataMap) {
          yearDataMap[year] = yearDataMap[year].concat(_bidderCountMap[year]);
        }
      }
    }
  }

  const chartData = {};
  chartData.labels = Object.keys(yearDataMap);
  chartData.series = [[]];
  for (let year in yearDataMap) {
    chartData.series[0].push(
      LMOCDSIndicatorUtils.getMedianFromArray(yearDataMap[year])
    );
  }

  return (
    <LMIndicatorSection
      chartData={chartData}
      description={METRIC_DESCRIPTION}
      indicator={median}
      indicatorSuffix="median # of bidders"
    />
  );
}
