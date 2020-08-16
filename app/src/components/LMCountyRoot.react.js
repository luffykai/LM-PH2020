"use strict";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CountyTypes from "../javascripts/utils/CountyTypes";
import LMTaiwanMap from "./LMTaiwanMap.react";
import GoogleMapReact from "google-map-react";

const DEFAULT_GOOGLE_MAP_ZOOM = 11;

const DEFAULT_GOOGLE_MAP_CENTER = {
  lat: 23.782127,
  lng: 120.956679,
};

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
  let leftContent = null;
  /* undefined will be casted to a string during ssr */
  if (county === "undefined") {
    // No county is specified, which means we're showing a Taiwan Map.
    rightContent = (
      <div className="rightContent">
        <div id="largeMetricAndUnit">
          <div id="largeMetric">6913</div>
          <span id="unit">
            House <br />
            Number
          </span>
        </div>
        <div>with {`613`} build cases in this area</div>
        <h5>Choose the county:</h5>
        <div className="marginTop-8">
          <a
            class="dropdown-trigger btn"
            href="#"
            data-target="county-dropdown"
          >
            Taiwan <i class="material-icons right">keyboard_arrow_down</i>
          </a>
        </div>
        <ul id="county-dropdown" class="dropdown-content">
          {Object.values(CountyTypes).map((name) => (
            <li>
              <a href={`/county?name=${name}`}>{countyNameFormatter(name)}</a>
            </li>
          ))}
        </ul>
      </div>
    );

    leftContent = (
      <>
        LMCountyRoot: {county}
        <LMTaiwanMap />
      </>
    );
  } else {
    // get a center for each county.
    // Return the whole view of a County
    leftContent = (
      <div style={{ height: "100%", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBBNbSvm6YtuprugNWiUGxFuEYYAJK36cw" }}
          defaultCenter={DEFAULT_GOOGLE_MAP_CENTER}
          defaultZoom={DEFAULT_GOOGLE_MAP_ZOOM}
        ></GoogleMapReact>
      </div>
    );
  }

  return (
    <div id="root">
      <div id="left">{leftContent}</div>
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

function countyNameFormatter(countyNameRaw) {
  const countyNames = countyNameRaw
    .split("_")
    .map(
      (_namePartRaw) =>
        `${_namePartRaw.slice(0, 1).toUpperCase()}${_namePartRaw.slice(1)}`
    );
  return countyNames.join(" ");
}

let domContainer = document.querySelector("#lm_county_root");
ReactDOM.render(<LMCountyRoot />, domContainer);
