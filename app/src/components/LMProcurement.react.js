"use strict";

import firebase from "./LMFirebase.react";
import LMFileUpload from "./LMFileUpload.react";
import LMRelease from "./LMRelease.react";

export default function LMProcurement(props) {
  const contractingProgress = props.contractingProgress;
  if (contractingProgress == null || contractingProgress.releases.length == 0) {
    return null;
  }
  const ocid = contractingProgress.releases[0].ocid;
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
      <div id="pocBox">
        <div className="pocRow">
          <div>ID: {contractingProgress.id}</div>
          {contractingProgress.releases.map(release => {
            return <LMRelease release={release} />;
          })}
          {firebase.auth().currentUser &&
            lastAwardRelease.awards.map(award => {
              return (
                <LMFileUpload
                  projectData={props.projectData}
                  projectID={props.projectID}
                  county={props.county}
                  ocid={ocid}
                  awardId={award.id}
                  contractIndex={props.contractIndex}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}
