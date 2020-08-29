"use strict";

import React, { useEffect } from "react";
import M from "materialize-css/dist/js/materialize.js";
import firebase from "./LMFirebase.react";
import LMFileUpload from "./LMFileUpload.react";
import LMRelease from "./LMRelease.react";

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
    .find(release => {
      return (
        release.tag.includes("award") || release.tag.includes("awardUpdate")
      );
    });

  return (
    <>
      <div class="row">
        {releases[0].tender && (
          <div class="row">
            <div class="col s12 valign-wrapper">
              <h4 style={{fontWeight: "bolder"}}>{releases[0].tender.title}</h4>
            </div>
            <div class="col s12 valign-wrapper">
              <div class="col s1 currency">NT$ </div>
              <div class="col s11 amount">
                {releases[0].tender.value.amount}
              </div>
            </div>
          </div>
        )}
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
                <LMRelease release={release} />
              </div>
              {firebase.auth().currentUser &&
                lastAwardRelease &&
                lastAwardRelease.awards.map(award => {
                  return (
                    <div class="col s12 row">
                      <LMFileUpload
                        projectData={props.projectData}
                        projectID={props.projectID}
                        county={props.county}
                        ocid={ocid}
                        awardId={award.id}
                        contractIndex={props.contractIndex}
                      />
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
      <div class="divider row"></div>
    </>
  );
}
