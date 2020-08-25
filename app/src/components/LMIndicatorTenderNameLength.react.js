import React from "react";
import LMIndicatorSection from "./LMIndicatorSection.react";
import LMOCDSIndicatorUtils from "../javascripts/utils/LMOCDSIndicatorUtils";

const METRIC_DESCRIPTION = `A higher rate of tenders without robust titles may signal lack
 of integrity. A short or undescriptive tender title reduces the opportunity for potential
 bidders to find and understand the announcement. This may lead to fewer potential tenderers
 choosing to bid`;

const startYear = 2013;

export default function LMIndicatorTenderNameLength({ fullData }) {
  const shortTitleObj = { shortTitleTenderCount: 0, tenderCount: 0 };

  for (let countyKey in fullData) {
    const countyData = fullData[countyKey];
    for (let oc4idsDataOfAProject of countyData.projects) {
      const countObj = LMOCDSIndicatorUtils.getNumberOfShortTitleTenderAndTotalTenderCount(
        oc4idsDataOfAProject,
        18
      );
      shortTitleObj.shortTitleTenderCount += countObj.shortTitleTenderCount;
      shortTitleObj.tenderCount += countObj.tenderCount;
    }
  }
  const shortTenderTitlePercentage =
    shortTitleObj.shortTitleTenderCount / shortTitleObj.tenderCount;
  const indicator = parseFloat(shortTenderTitlePercentage * 100).toFixed(2);

  return (
    <LMIndicatorSection
      description={METRIC_DESCRIPTION}
      indicator={indicator}
      indicatorSuffix="%"
    />
  );
}
