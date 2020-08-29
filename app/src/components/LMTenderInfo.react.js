"use strict";

import React from "react";

export default function LMTenderInfo(props) {
  const release = props.release;
  if (release == null) {
    return null;
  }

  return (
    <>
      <div class="col s4">招標方式: 公開招標</div>
      <div class="col s4">決標方式: {release.tender.awardCriteria}</div>
      <div class="col s4">
        公告時間: {new Date(release.date).toLocaleDateString()}
      </div>
    </>
  );
}
