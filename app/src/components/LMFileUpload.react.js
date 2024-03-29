"use strict";

import React, { useState } from "react";
import M from "materialize-css/dist/js/materialize.js";

import buildOCDSImplUpdateRelease from "../javascripts/utils/BuildOCDSUtils";
import firebase from "./LMFirebase.react";

const storageRef = firebase.storage().ref();
const db = firebase.firestore();

export default function LMFileUpload(props) {
  const [file, setFile] = useState(null);

  const uploadFile = function(file) {
    if (file == null) {
      M.toast({ html: "No file selected" });
      return;
    }
    var uploadTask = storageRef
      .child(`${props.uploadContext.projectID}/${file.name}`)
      .put(file, {
        contentType: file.type
      });
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      function(snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        // const progress =
        //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            M.toast({ html: "Upload paused" });
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            break;
        }
      },
      function(error) {
        // Handle unsuccessful uploads
        console.log(error);
        M.toast({ html: "Upload failed" });
      },
      function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          M.toast({ html: "File uploaded" });
          const implUpdateRelease = buildOCDSImplUpdateRelease(
            props.uploadContext.ocid,
            props.awardId,
            [{ fileName: file.name, url: downloadURL, type: file.type }]
          );
          props.uploadContext.projectData.projects[0].contractingProcesses[
            props.uploadContext.contractIndex
          ].releases.push(implUpdateRelease);
          db.collection("counties")
            .doc(props.uploadContext.county)
            .collection("projects")
            .doc(props.uploadContext.projectID)
            .update(props.uploadContext.projectData);
        });
      }
    );
  };

  return (
    <div class="row">
      <div class="col s10">
        <form action="#">
          <div class="file-field input-field">
            <div class="btn lm-pink-1">
              <span>File</span>
              <input
                type="file"
                id="upload"
                onChange={event => {
                  const fileList = event.target.files;
                  if (fileList.length == 0) {
                    return;
                  }
                  setFile(fileList[0]);
                }}
              />
            </div>
            <div class="file-path-wrapper">
              <input class="file-path validate" type="text" />
            </div>
          </div>
        </form>
      </div>
      <div class="col s2">
        <a
          className="btn-large lm-pink-1"
          onClick={() => {
            uploadFile(file);
          }}
        >
          Upload
        </a>
      </div>
    </div>
  );
}
