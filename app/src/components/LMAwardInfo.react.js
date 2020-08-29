"use strict";

import React from "react";
import firebase from "./LMFirebase.react";
import LMAwardItems from "./LMAwardItems.react";
import LMAwardSuppliers from "./LMAwardSuppliers.react";
import LMFileUpload from "./LMFileUpload.react";

export default function LMAwardInfo(props) {
  const release = props.release;
  if (release == null || release.awards == null) {
    return null;
  }

  return (
    <>
      {release.awards.map((award, index) => {
        return (
          <>
            <LMAwardSuppliers suppliers={award.suppliers} />
            <LMAwardItems items={award.items} />
            {firebase.auth().currentUser && (
              <LMFileUpload
                uploadContext={props.uploadContext}
                awardId={award.id}
              />
            )}
          </>
        );
      })}
    </>
  );
}
