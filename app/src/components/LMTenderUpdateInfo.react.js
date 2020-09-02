"use strict";

import React from "react";

export default function LMTenderUpdateInfo(props) {
  const release = props.release;
  if (release == null || release.tender == null) {
    return null;
  }
  const tender = release.tender;
  return (
    <>
      {tender.status != null && tender.status === "unsuccessful" && (
        <>
          <div className="col s4 lm-pink-text-2">招標狀態:</div>
          <div className="col s8 lm-pink-text-1">流標</div>
        </>
      )}
      {tender.status != null && tender.status === "cancelled" && (
        <>
          <div className="col s4">招標狀態:</div>
          <div className="col s8">廢標</div>
        </>
      )}
      <div className="row lm-note-m">
        {tender.additionalProperties != null &&
          Array.isArray(tender.additionalProperties.otherInformation) &&
          tender.additionalProperties.otherInformation.length > 0 &&
          tender.additionalProperties.otherInformation[0] !== "" && (
            <>
              <div className="col s4">公告內容:</div>
              <div className="col s8">
                {tender.additionalProperties.otherInformation[0]}
              </div>
            </>
          )}
      </div>
    </>
  );
}
