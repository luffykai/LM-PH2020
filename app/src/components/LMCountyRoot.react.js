"use strict";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

// Your web app's Firebase configuration
const FIREBASE_CONFIG = {
  apiKey: "", /* Please Fill in apiKey */
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

function WorldMap() {
  const dataDiv = document.getElementById("county-map-data");
  let worlddata = JSON.parse(dataDiv.getAttribute("mapData"));
  //worlddata = worlddata.features;
  worlddata = topojson.feature(worlddata, worlddata.objects.COUNTY_MOI_1090727)
    .features;
  let width = 800;
  let height = 680;

  const myProjection = () => {
    return d3
      .geoMercator()
      .scale(10000)
      .center([121, 24.3])
      .translate([width / 2, height / 2.5]);
  };

  return (
    <div>
      <svg className="map-svg" width={800} height={680} viewBox="0 0 800 680">
        <g className="countries">
          {worlddata.map((d, i) => (
            <path
              key={`path-${i}`}
              d={d3.geoPath().projection(myProjection())(d)}
              className="country"
              fill={`rgba(219, 163, 43,${(1 / worlddata.length) * i})`}
              stroke="#FFFFFF"
              strokeWidth={0.5}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

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
  if (county == null) {
    throw "county is null in LWICountyRoot";
  }

  return (
    <div>
      LMCountyRoot: {county}
      aaaaa
      <WorldMap />
      {documents.map((name) => (
        <div>{name}</div>
      ))}
    </div>
  );
}

let domContainer = document.querySelector("#lm_county_root");
ReactDOM.render(<LMCountyRoot />, domContainer);
