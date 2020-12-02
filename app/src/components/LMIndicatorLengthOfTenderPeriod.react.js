import React from "react";
import LMIndicatorSection from "./LMIndicatorSection.react";
import LMOCDSIndicatorUtils from "../javascripts/utils/LMOCDSIndicatorUtils";
import moment from "moment";

const METRIC_DESCRIPTION = `A higher median number of bidders per tender
may indicate limited sole-sourcing and that tenders fairer competition.
It may indicate increased competition and trust in the contracting system.`;

// Create an Array of int from 2010 to 2019.
const YEARS = Array.from(Array(10), (_, i) => i + 2010);

export default function LMIndicatorLengthOfTenderPeriod({ fullData, id }) {
  const yearDataMap = Object.create(null);
  for (let year of YEARS) {
    yearDataMap[year] = [];
  }
  for (let countyKey in fullData) {
    const countyData = fullData[countyKey];
    for (let project of countyData.projects) {
      for (let contract of project.contractingProcesses) {
        const latestTenderEndDate = LMOCDSIndicatorUtils.getLatestTenderEndDate(
          contract
        );
        const startDateObject = LMOCDSIndicatorUtils.getContractingProcessEarliestTenderStartDate(
          contract
        );
        if (startDateObject == null || latestTenderEndDate == null) {
          continue;
        }

        const year = startDateObject.getFullYear();

        if (year in yearDataMap) {
          yearDataMap[year].push(
            moment(new Date(latestTenderEndDate)).diff(
              moment(startDateObject),
              "days"
            )
          );
        }
      }
    }
  }

  const chartData = {};
  chartData.labels = Object.keys(yearDataMap);
  chartData.series = [[]];
  for (let year in yearDataMap) {
    chartData.series[0].push(
      yearDataMap[year].reduce((acc, curr) => acc + curr, 0) /
        yearDataMap[year].length
    );
  }
  const indicator = parseFloat(
    chartData.series[0].reduce((acc, curr) => acc + curr, 0) /
      chartData.series[0].length
  ).toFixed(2);

  return (
    <LMIndicatorSection
      chartData={chartData}
      description={METRIC_DESCRIPTION}
      id={id}
      indicator={indicator}
      indicatorSuffix="length of tender period"
    />
  );
}
