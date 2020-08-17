"use strict";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

// Your web app's Firebase configuration
const FIREBASE_CONFIG = {
  apiKey: "" /* Please Fill in apiKey */,
  authDomain: "lm-ph2020.firebaseapp.com",
  databaseURL: "https://lm-ph2020.firebaseio.com",
  projectId: "lm-ph2020",
  storageBucket: "lm-ph2020.appspot.com",
  messagingSenderId: "1083392040408",
  appId: "1:1083392040408:web:38449f3320b530d891e6ad",
  measurementId: "G-JES8JBQ70D",
};

// // Initialize Cloud Firestore through Firebase
firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.firestore();

export default function LMProjectRoot() {
  const dataDiv = document.getElementById("project-data");
  const county = dataDiv.getAttribute("county");
  const projectID = dataDiv.getAttribute("projectID");

  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    db.collection("counties")
      .doc(county)
      .collection("projects")
      .doc(projectID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setProjectData(doc.data());
        } else {
          console.log("No such document!");
        }
      });
  }, [county]);

  if (county == null || projectID == null) {
    throw `At least one of county:${county} or projectID: ${projectID} is null in LWIProjectRoot`;
  }

  return (
    <div id="root">
      {JSON.stringify(projectData)}
      <div id="left"></div>
      <div id="right"></div>
    </div>
  );
}

const domContainer = document.querySelector("#lm_project_root");
ReactDOM.render(<LMProjectRoot />, domContainer);
