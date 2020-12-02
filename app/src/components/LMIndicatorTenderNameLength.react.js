import React from "react";
import LMIndicatorSection from "./LMIndicatorSection.react";
import LMOCDSIndicatorUtils from "../javascripts/utils/LMOCDSIndicatorUtils";
import moment from "moment";

const METRIC_DESCRIPTION = `A higher rate of tenders without robust titles may signal lack
 of integrity. A short or undescriptive tender title reduces the opportunity for potential
 bidders to find and understand the announcement. This may lead to fewer potential tenderers
 choosing to bid`;

const startYear = 2013;
const TITLE_LENGTH_THRESHOLD = 18;

export default function LMIndicatorTenderNameLength({ fullData, id }) {
  // Build Aggregated Number
  const shortTitleObj = { shortTitleTenderCount: 0, tenderCount: 0 };

  for (let countyKey in fullData) {
    const countyData = fullData[countyKey];
    for (let oc4idsDataOfAProject of countyData.projects) {
      const countObj = LMOCDSIndicatorUtils.getNumberOfShortTitleTenderAndTotalTenderCount(
        oc4idsDataOfAProject,
        TITLE_LENGTH_THRESHOLD
      );
      shortTitleObj.shortTitleTenderCount += countObj.shortTitleTenderCount;
      shortTitleObj.tenderCount += countObj.tenderCount;
    }
  }
  const shortTenderTitlePercentage =
    shortTitleObj.shortTitleTenderCount / shortTitleObj.tenderCount;
  const indicator = parseFloat(shortTenderTitlePercentage * 100).toFixed(2);

  // Build Chart Data
  const yearDataMap = Object.create(null);

  for (let countyKey in fullData) {
    const countyData = fullData[countyKey];
    for (let project of countyData.projects) {
      for (let contract of project.contractingProcesses) {
        for (let release of contract.releases) {
          const date = moment(release.date);
          const title = release?.tender?.title;

          if (title == null) {
            continue;
          }

          const year = date.year();
          if (!(year in yearDataMap)) {
            yearDataMap[year] = { total: 0, count: 0 };
          }

          if (title.length < TITLE_LENGTH_THRESHOLD) {
            yearDataMap[year].count++;
          }
          yearDataMap[year].total++;
        }
      }
    }
  }

  const chartDataSeries = [[]];
  for (let yearKey in yearDataMap) {
    const yearMap = yearDataMap[yearKey];
    chartDataSeries[0].push(yearMap.count / yearMap.total);
  }

  return (
    <LMIndicatorSection
      chartData={{
        labels: Object.keys(yearDataMap),
        series: chartDataSeries,
      }}
      description={METRIC_DESCRIPTION}
      id={id}
      indicator={indicator}
      indicatorSuffix={`% of tenders with fewer than ${TITLE_LENGTH_THRESHOLD} characters in the title`}
    />
  );
}
