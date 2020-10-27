import React from "react";
import LMIndicatorSection from "./LMIndicatorSection.react";
import LMOCDSIndicatorUtils from "../javascripts/utils/LMOCDSIndicatorUtils";

const METRIC_DESCRIPTION = `Longer time delays between phases of the contracting process can
 signal inefficiency in the contracting process.`;

const DEFINITION_IMAGE = <img src="images/start_award.png" />;
const YEARS = Array.from(Array(10), (_, i) => i + 2010);

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

  // build chart
  // {year => [duration, ...]}
  const yearMap = {};

  for (let countyKey in fullData) {
    const countyData = fullData[countyKey];
    for (let oc4idsDataOfAProject of countyData.projects) {
      for (let contractingProcess of oc4idsDataOfAProject.contractingProcesses) {
        const duration = LMOCDSIndicatorUtils.getTenderStartToAwardDurationFromContractingProcess(
          contractingProcess
        );

        if (duration == null) {
          continue;
        }

        const startDate = LMOCDSIndicatorUtils.getContractingProcessEarliestTenderStartDate(
          contractingProcess
        );
        if (startDate == null) {
          continue;
        }
        const startYear = startDate.getFullYear();
        if (!(startYear in yearMap)) {
          yearMap[startYear] = [duration];
        } else {
          yearMap[startYear].push(duration);
        }
      }
    }
  }

  const chartData = {};
  chartData.labels = YEARS;
  chartData.series = [[]];

  for (let year of YEARS) {
    if (!year in yearMap) {
      chartData.series[0].push(0);
    } else {
      const val =
        yearMap[year].reduce((acc, cur) => cur + acc) / yearMap[year].length;
      chartData.series[0].push(val);
    }
  }

  return (
    <LMIndicatorSection
      chartData={chartData}
      definition={DEFINITION_IMAGE}
      description={METRIC_DESCRIPTION}
      id={id}
      indicator={indicator}
      indicatorSuffix="days from tender start to award decision"
    />
  );
}
