import React from "react";
import LMIndicatorSection from "./LMIndicatorSection.react";
import LMOCDSIndicatorUtils from "../javascripts/utils/LMOCDSIndicatorUtils";
import moment from "moment";

const METRIC_DESCRIPTION = `Longer time delays between phases of the contracting process can
signal inefficiency in the contracting process.`;

// Create an Array of int from 2010 to 2019.
const YEARS = Array.from(Array(10), (_, i) => i + 2010);

const getLatestTenderEndDate = function(contract) {
  for (let i = contract?.releases?.length - 1 ?? -1; i >= 0; --i) {
    const endDate = contract.releases[i]?.tender?.tenderPeriod?.endDate;
    if (endDate !== undefined) { 
      return endDate;
    }
  }
  return null;
}

const getLatestAwardDecisionDate = function(contract) {
  for (let i = contract?.releases?.length - 1 ?? -1; i >= 0; --i) {
    const startDate = contract.releases[i]?.tender?.contractPeriod?.startDate;
    if (startDate !== undefined) { 
      return startDate;
    }
  }
  return null;
}

export default function LMIndicatorTenderCloseToAward({ fullData, id }) {
  // Initialize this map
  const yearDataMap = Object.create(null);
  for (let year of YEARS) {
    yearDataMap[year] = [];
  }
  for (let countyKey in fullData) {
    const countyData = fullData[countyKey];
    for (let project of countyData.projects) {
      for (let contract of project.contractingProcesses) {
        const latestTenderEndDate = getLatestTenderEndDate(contract);
        const latestAwardDecisionDate = getLatestAwardDecisionDate(contract);
        if (latestTenderEndDate == null || latestAwardDecisionDate == null) {
          continue;
        }
        const year = LMOCDSIndicatorUtils.getContractEarliestTenderOrAwardStartYear(contract);
        if (year in yearDataMap) {
          yearDataMap[year].push(
            moment(new Date(latestAwardDecisionDate)).diff(
                moment(new Date(latestTenderEndDate)), 'days')
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
      yearDataMap[year].reduce(
          (acc, curr) => (acc + curr)
      , 0) / yearDataMap[year].length
    );
  }
  const indicator = parseFloat(chartData.series[0].reduce(
      (acc, curr) => (acc + curr), 0) / chartData.series[0].length).toFixed(2);

  return (
    <LMIndicatorSection
      chartData={chartData}
      description={METRIC_DESCRIPTION}
      id={id}
      indicator={indicator}
      indicatorSuffix="days from tender close to award decision"
    />
  );
}
