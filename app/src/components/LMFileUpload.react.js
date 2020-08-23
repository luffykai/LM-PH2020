"use strict";

import React, { useEffect, useState } from "react";

import firebase from "./LMFirebase.react";

const storageRef = firebase.storage().ref();

export default function LMFileUpload(props) {
  const [file, setFile] = useState(null);
  const [statusText, setStatusText] = useState("");

  const uploadFile = function(filePath, file) {
    if (file == null) {
      setStatusText("No file has been selected.");
      return;
    }
    var uploadTask = storageRef.child(`${filePath}/${file.name}`).put(file, {
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
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setStatusText(`Upload is ${progress}% done`);
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            break;
        }
      },
      function(error) {
        // Handle unsuccessful uploads
        console.log(error);
      },
      function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          setStatusText(`File available at ${downloadURL}`);
        });
      }
    );
  };

  return (
    <>
      <h3>File Upload</h3>
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
      <button
        onClick={() => {
          uploadFile(props.filepath, file);
        }}
      >
        Upload
      </button>
      <h5>{statusText}</h5>
    </>
  );
}
