import React from "react";
import LMIndicatorSection from "./LMIndicatorSection.react";
import LMOCDSIndicatorUtils from "../javascripts/utils/LMOCDSIndicatorUtils";

const METRIC_DESCRIPTION = `A higher percentage of contracts with cost and/or time overruns 
can signal inefficient contracting processes and poorer value for money. Information 
about cost overruns is important for analyzing overall efficiency.`;

// Create an Array of int from 2010 to 2019.
const YEARS = Array.from(Array(10), (_, i) => i + 2010);

const getLatestTenderBudgetAmount = function (contract) {
  for (let i = contract?.releases?.length - 1 ?? -1; i >= 0; --i) {
    const amount = contract.releases[i]?.tender?.value?.amount;
    if (amount !== undefined) {
      return amount;
    }
  }
  return null;
};

const getLatestAwardAmount = function (contract) {
  for (let i = contract?.releases?.length - 1 ?? -1; i >= 0; --i) {
    const release = contract.releases[i];
    if (!Array.isArray(release.awards) || release.awards.length == 0) {
      continue;
    }
    let totalAmount = 0;
    for (let award of release.awards) {
      const awardAmount = award?.value?.amount;
      if (awardAmount !== undefined) {
        totalAmount += awardAmount;
      }
    }
    return totalAmount;
  }
  return null;
};

export default function LMIndicatorExceedBudget({ fullData, id }) {
  // Initialize this map
  const yearDataMap = Object.create(null);
  for (let year of YEARS) {
    yearDataMap[year] = [];
  }
  for (let countyKey in fullData) {
    const countyData = fullData[countyKey];
    for (let project of countyData.projects) {
      for (let contract of project.contractingProcesses) {
        const latestTenderBudgetAmount = getLatestTenderBudgetAmount(contract);
        const latestAwardAmount = getLatestAwardAmount(contract);
        if (latestTenderBudgetAmount == null || latestAwardAmount == null) {
          continue;
        }
        const year = LMOCDSIndicatorUtils.getContractEarliestTenderOrAwardStartYear(
          contract
        );
        if (year in yearDataMap) {
          yearDataMap[year].push(latestAwardAmount - latestTenderBudgetAmount);
        }
      }
    }
  }
  const chartData = {};
  chartData.labels = Object.keys(yearDataMap);
  chartData.series = [[]];
  for (let year in yearDataMap) {
    chartData.series[0].push(
      yearDataMap[year]
        .map((x) => x > 0)
        .reduce((accumulator, curr) => accumulator + (curr ? 1 : 0), 0) /
        yearDataMap[year].length
    );
  }
  const indicator =
    chartData.series[0].reduce((acc, curr) => acc + curr, 0) /
    chartData.series[0].length;

  return (
    <LMIndicatorSection
      chartData={chartData}
      description={METRIC_DESCRIPTION}
      id={id}
      indicator={indicator}
      indicatorSuffix="% of contracts that exceed budget"
    />
  );
}
