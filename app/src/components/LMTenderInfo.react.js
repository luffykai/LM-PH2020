"use strict";

import React from "react";

const getProcurementCategoryText = function(category) {
  switch (category) {
    case "works":
      return "工程";
    case "goods":
      return "財務";
    case "services":
      return "勞務";
    default:
      return "不明";
  }
};

export default function LMTenderInfo(props) {
  const release = props.release;
  if (release == null || release.tender == null) {
    return null;
  }
  const tender = release.tender;
  return (
    <>
      <div className="row">
        <div className="col s4">
          <span className="lm-pink-text-2">招標方式: </span>
          <span className="lm-pink-text-1">公開招標</span>
        </div>
        <div className="col s4">
          {tender.additionalProperties != null &&
            tender.additionalProperties.minimumValueExists != null && (
              <>
                <span className="lm-pink-text-1">
                  {tender.additionalProperties.minimumValueExists ? "O " : "X "}
                </span>
                <span className="lm-pink-text-2">訂有底價</span>
              </>
            )}
        </div>
        <div className="col s4">
          {release.date != null && (
            <>
              <span className="lm-pink-text-2">公告時間: </span>
              <span className="lm-pink-text-1">
                {new Date(release.date).toLocaleDateString()}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col s4">
          <span className="lm-pink-text-2">決標方式: </span>
          <span className="lm-pink-text-1">公開招標</span>
        </div>
        <div className="col s4">
          {tender.additionalProperties != null &&
            tender.additionalProperties.evaluateOnValue != null && (
              <>
                <span className="lm-pink-text-1">
                  {tender.additionalProperties.evaluateOnValue ? "O " : "X "}
                </span>
                <span className="lm-pink-text-2">價格納入評選</span>
              </>
            )}
        </div>
        <div className="col s4">
          {release.tender.tenderPeriod != null &&
            release.tender.tenderPeriod.endDate != null && (
              <>
                <span className="lm-pink-text-2">截止投標: </span>
                <span className="lm-pink-text-1">
                  {new Date(
                    release.tender.tenderPeriod.endDate
                  ).toLocaleDateString()}
                </span>
              </>
            )}
        </div>
      </div>
      <div className="row">
        <div className="col s4">
          <span className="lm-pink-text-2">採購性質: </span>
          <span className="lm-pink-text-1">
            {getProcurementCategoryText(tender.mainProcurementCategory)}
          </span>
        </div>
        <div className="col s4">
          {tender.additionalProperties != null &&
            tender.additionalProperties.isTurnkeyProcurement != null && (
              <>
                <span className="lm-pink-text-1">
                  {tender.additionalProperties.isTurnkeyProcurement
                    ? "O "
                    : "X "}
                </span>
                <span className="lm-pink-text-2">此標案屬統包</span>
              </>
            )}
        </div>
        <div className="col s4">
          {release.tender.contractPeriod != null &&
            release.tender.contractPeriod.startDate != null && (
              <>
                <span className="lm-pink-text-2">開標時間: </span>
                <span className="lm-pink-text-1">
                  {new Date(
                    release.tender.contractPeriod.startDate
                  ).toLocaleDateString()}
                </span>
              </>
            )}
        </div>
      </div>
      <div className="divider row lm-pink-1"></div>
      <div className="row lm-note-m">
        {tender.additionalProperties != null &&
          tender.additionalProperties.rawContractDueDate != null && (
            <>
              <div className="col s4">履約期限:</div>
              <div className="col s8">
                {tender.additionalProperties.rawContractDueDate}
              </div>
            </>
          )}
        {tender.eligibilityCriteria != null && (
          <>
            <div className="col s4">廠商資格:</div>
            <div className="col s8">{tender.eligibilityCriteria}</div>
          </>
        )}
      </div>
    </>
  );
}
