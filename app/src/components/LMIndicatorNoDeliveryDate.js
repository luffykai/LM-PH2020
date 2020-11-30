import React from "react";
import LMIndicatorSection from "./LMIndicatorSection.react";
import LMOCDSIndicatorUtils from "../javascripts/utils/LMOCDSIndicatorUtils";

const METRIC_DESCRIPTION = `Tenders without specific delivery date 
may indicate ...`;

// Create an Array of int from 2010 to 2019.
const YEARS = Array.from(Array(10), (_, i) => i + 2010);

const hasDeliveryDate = function(contract) {
  for (let release of contract.releases) {
    let endDate = release.tender?.contractPeriod?.endDate;
    if (endDate != null) {
      return 1;
    }
  }
  return 0;
}

export default function LMIndicatorNoDeliveryDate({ fullData, id }) {
  // Initialize this map
  const yearDataMap = Object.create(null);
  for (let year of YEARS) {
    yearDataMap[year] = [];
  }
  for (let countyKey in fullData) {
    const countyData = fullData[countyKey];
    for (let project of countyData.projects) {
      for (let contract of project.contractingProcesses) {
        let ok = hasDeliveryDate(contract);
        const year = LMOCDSIndicatorUtils.getContractEarliestTenderOrAwardStartYear(contract);
        if (year in yearDataMap) {
          yearDataMap[year].push(ok);
        }
      }
    }
  }
  const chartData = {};
  chartData.labels = Object.keys(yearDataMap);
  chartData.series = [[]];
  for (let year in yearDataMap) {
    chartData.series[0].push(
      // sum / length
      1 - yearDataMap[year].reduce((a, b) => a + b, 0) / yearDataMap[year].length
    );
  }
  let allAvg = chartData.series[0].reduce((a, b) => a + b, 0) / chartData.series[0].length * 100;
  return (
    <LMIndicatorSection
      chartData={chartData}
      description={METRIC_DESCRIPTION}
      id={id}
      indicator={allAvg.toFixed(2)}
      indicatorSuffix="%"
    />
  );
}
