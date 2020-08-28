"use strict";

import React from "react";

export default function LMProcurementRelease(props) {
  const release = props.release;
  if (release == null) {
    return null;
  }

  return (
    <>
      <div id="pocBox">
        <div className="pocRow">
          <div>OCID: {release.ocid}</div>
        </div>
      </div>
    </>
  );
}
