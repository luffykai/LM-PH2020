"use strict";

import React from "react";
import LMAwardInfo from "./LMAwardInfo.react";
import LMImplUpdateInfo from "./LMImplUpdateInfo.react";
import LMTenderInfo from "./LMTenderInfo.react";
import LMTenderUpdateInfo from "./LMTenderUpdateInfo.react";

export default function LMProcurementRelease(props) {
  const release = props.release;
  if (release == null) {
    return null;
  }

  return (
    <>
      {release.tag[0] === "tender" && <LMTenderInfo release={props.release} />}
      {(release.tag[0] === "award" || release.tag[0] === "awardUpdate") && (
        <LMAwardInfo
          release={props.release}
          uploadContext={props.uploadContext}
        />
      )}
      {release.tag[0] === "implementationUpdate" && (
        <LMImplUpdateInfo release={props.release} />
      )}
      {(release.tag[0] === "tenderUpdate" || release.tag[0] === "planning") && (
        <LMTenderUpdateInfo release={props.release} />
      )}
      {/* {(release.tag[0] === "awardUpdate") && (
        <p className="lm-note-m">under construction</p>
      )} */}
    </>
  );
}
