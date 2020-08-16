"use strict";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import LMTaiwanMap from "./LMTaiwanMap.react";
import GoogleMapReact from "google-map-react";
import CountyMapDefaults from "../javascripts/utils/CountyMapDefaults";
import LMProjectRow from "./LMProjectRow.react";
import LMCountySelector from "./LMCountySelector.react";

import { useDebounce } from "use-debounce";

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
  const [searchTerm, setSearchTerm] = useState("");

  const [debounceSearchTerm] = useDebounce(searchTerm, 800);

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
  }, [county]);

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
        <div className="marginTop-8"></div>
        <LMCountySelector selectedCounty={null} />
      </div>
    );

    leftContent = <LMTaiwanMap />;
  } else {
    // When a county is selected, we show its map and projects
    const countyMapDefaults = CountyMapDefaults[county];

    leftContent = (
      <div style={{ height: "100%", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBBNbSvm6YtuprugNWiUGxFuEYYAJK36cw" }}
          defaultCenter={countyMapDefaults.center}
          defaultZoom={countyMapDefaults.zoom}
        ></GoogleMapReact>
      </div>
    );

    rightContent = (
      <>
        <LMCountySelector selectedCounty={county} />
        <input
          type="text"
          value={searchTerm}
          onInput={(e) => setSearchTerm(e.target.value)}
        />
        {documents.map((name) => {
          if (
            debounceSearchTerm !== "" &&
            name.indexOf(debounceSearchTerm) < 0
          ) {
            return null;
          }

          return <LMProjectRow id={name} name={name} />;
        })}
      </>
    );
  }

  return (
    <div id="root">
      <div id="left">{leftContent}</div>
      <div id="right">
        <div class="marginTop-20 scroll">{rightContent}</div>
      </div>
    </div>
  );
}

let domContainer = document.querySelector("#lm_county_root");
ReactDOM.render(<LMCountyRoot />, domContainer);
