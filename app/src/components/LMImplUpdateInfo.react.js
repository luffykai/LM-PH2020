"use strict";

import React from "react";

export default function LMImplUpdateInfo(props) {
  const release = props.release;
  if (release == null || !Array.isArray(release.contracts)) {
    return null;
  }
  const contracts = release.contracts;
  return (
    <>
      {contracts.map(contract => {
        if (
          contract.implementation == null ||
          !Array.isArray(contract.implementation.documents)
        ) {
          return null;
        }

        return (
          <>
            {contract.implementation.documents.map(document => {
              return (
                <div className="row">
                  <a href={document.url}>
                    <i class="material-icons left">file_download</i>
                  </a>
                  <span className="lm-pink-text-2">檔案名稱: </span>
                  <span className="lm-pink-text-1">{document.title}</span>
                </div>
              );
            })}
          </>
        );
      })}
    </>
  );
}
