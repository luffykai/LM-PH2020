"use strict";

import React, { useEffect } from "react";
import M from "materialize-css/dist/js/materialize.js";
import LMFileUpload from "./LMFileUpload.react";
import LMRelease from "./LMRelease.react";

const getProcurementTitle = function (release) {
  if (
    release != null &&
    release.tender != null &&
    release.tender.title != null
  ) {
    return release.tender.title;
  }
  if (!Array.isArray(release.awards) || release.awards.length == 0) {
    return "unknown";
  }
  return release.awards[0].title;
};

const getTotalAmount = function (release) {
  if (
    release != null &&
    release.tender != null &&
    release.tender.value != null
  ) {
    return release.tender.value.amount;
  }
  if (!Array.isArray(release.awards) || release.awards.length == 0) {
    return "unknown";
  }
  let totalAmount = 0.0;
  for (const award of release.awards) {
    totalAmount += award.value.amount;
  }
  return totalAmount;
};

export default function LMProcurement(props) {
  useEffect(() => {
    const tabsDivs = document.getElementsByClassName("tabs");
    for (const tabsDiv of tabsDivs) {
      M.Tabs.init(tabsDiv);
    }
  });

  const contractingProgress = props.contractingProgress;
  if (contractingProgress == null || contractingProgress.releases.length == 0) {
    return null;
  }
  const releases = contractingProgress.releases;
  const ocid = releases[0].ocid;
  const lastAwardRelease = contractingProgress.releases
    .slice()
    .reverse()
    .find((release) => {
      return (
        release.tag.includes("award") || release.tag.includes("awardUpdate")
      );
    });

  return (
    <>
      <div class="row">
        <div class="row">
          <div class="col s12 valign-wrapper">
            <h4 style={{ fontWeight: "bolder" }}>
              {getProcurementTitle(releases[0])}
            </h4>
          </div>
          <div class="col s12 valign-wrapper">
            <div class="col s1 currency">NT$ </div>
            <div class="col s11 amount">{getTotalAmount(releases[0])}</div>
          </div>
        </div>
        <div class="col s12">
          <ul class="tabs">
            {contractingProgress.releases.map((release, index) => {
              return (
                <li class="tab col s3">
                  <a href={`#${release.id}-${index}`}>{release.tag[0]}</a>
                </li>
              );
            })}
          </ul>
        </div>
        {contractingProgress.releases.map((release, index) => {
          return (
            <div id={`${release.id}-${index}`} class="col s12 row info-bubble">
              <div class="col s12 row">
                <LMRelease
                  release={release}
                  uploadContext={{
                    projectData: props.projectData,
                    projectID: props.projectID,
                    county: props.county,
                    contractIndex: props.contractIndex,
                    ocid: ocid,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div class="divider row"></div>
    </>
  );
}
