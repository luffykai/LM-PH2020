"use strict";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CountyTypes from "../javascripts/utils/CountyTypes";
import LMTaiwanMap from './LMTaiwanMap.react';

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

export default function LMCountyRoot() {
  const dataDiv = document.getElementById("county-map-data");
  const data = JSON.parse(dataDiv.getAttribute("data"));
  const county = dataDiv.getAttribute("county");

  console.log("county", county);

  const [documents, setDocuments] = useState([]);

  // Fetch the data with an effect
  useEffect(() => {
    db.collection("counties")
      .doc(county)
      .collection("projects")
      .get()
      .then((querySnapshot) => {
        const _documemts = [];
        querySnapshot.forEach((doc) => {
          _documemts.push(doc.data().projects[0].title);
        });
        setDocuments(_documemts);
      });
  }, []);

  if (data == null) {
    throw "data is null in LWICountyRoot";
  }
  let rightContent = null;
  /* undefined will be casted to a string during ssr */
  if (county === "undefined") {
    // No county is specified, which means we're showing a Taiwan Map.
    rightContent = (
      <>
        <a class="dropdown-trigger btn" href="#" data-target="county-dropdown">
          Taiwan <i class="material-icons right">keyboard_arrow_down</i>
        </a>
        <ul id="county-dropdown" class="dropdown-content">
          {Object.values(CountyTypes).map((name) => (
            <li>
              <a href={`/county?name=${name}`}>{name}</a>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <div id="root">
      <div id="left">
        LMCountyRoot: {county}
        <LMTaiwanMap />
      </div>
      <div id="rigth">
        <div class="marginTop-20">
          {documents.map((name) => (
            <div>{name}</div>
          ))}
          {rightContent}
        </div>
      </div>
    </div>
  );
}

let domContainer = document.querySelector("#lm_county_root");
ReactDOM.render(<LMCountyRoot />, domContainer);
