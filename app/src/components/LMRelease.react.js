"use strict";

import React from "react";
import LMTenderInfo from "./LMTenderInfo.react";

export default function LMProcurementRelease(props) {
  const release = props.release;
  if (release == null) {
    return null;
  }

  return (
    <>
      {release.tag[0] === "tender" && <LMTenderInfo release={props.release} />}
      {/* {release.tag[0] === "award" && <LMTenderInfo release={props.release} />} */}
    </>
  );
}
