"use strict";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import LMTaiwanMap from "./LMTaiwanMap.react";
import GoogleMapReact from "google-map-react";
import CountyMapDefaults from "../javascripts/utils/CountyMapDefaults";
import LMProjectRow from "./LMProjectRow.react";
import LMCountySelector from "./LMCountySelector.react";
import LMNavBar from "./LMNavBar.react";
import firebase from "./LMFirebase.react";
import geoJson from "../../public/data/lm-ph2020-wgs84.geojson";

import { useDebounce } from "use-debounce";

const db = firebase.firestore();

const apiIsLoaded = (map, maps) => {
  map.data.addGeoJson(geoJson);
  map.data.setStyle({
    fillColor: "#fb4a78",
    strokeColor: "#f84081",
    strokeWeight: 1
  });
};

export default function LMCountyRoot() {
  const dataDiv = document.getElementById("county-map-data");
  const county = dataDiv.getAttribute("county");

  // documents is an array of name and id object.
  /*
  {
    id: "cc4cfad203a7335c293b6e75f81e0bf0",
    name: "大安青年社會住宅 (三重1館)",
  }
  */
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // a field only to be set by when a user is hovering the map.
  const [hoveredCounty, setHoveredCounty] = useState(null);

  const [debounceSearchTerm] = useDebounce(searchTerm, 800);

  // Fetch the data with an effect
  useEffect(() => {
    db.collection("counties")
      .doc(county)
      .collection("projects")
      .get()
      .then(querySnapshot => {
        const _documemts = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          _documemts.push({
            id: data.projects[0].id,
            name: data.projects[0].title
          });
        });
        setDocuments(_documemts);
      });
  }, [county]);

  let rightContent = null;
  let leftContent = null;
  /* undefined will be casted to a string during ssr */
  if (county === "undefined") {
    // No county is specified, which means we're showing a Taiwan Map.
    rightContent = (
      <div className="rightContent">
        <div>
          <div id="largeMetricAndUnit">
            <div id="largeMetric">6913</div>
            <span id="unit">
              House <br />
              Number
            </span>
          </div>
          <div id="allCases">with {`613`} build cases in this area</div>
          {hoveredCounty == null ? (
            <>
              <h5>Choose the county:</h5>
              <div className="marginTop-8"></div>
              <LMCountySelector selectedCounty={null} />
            </>
          ) : (
            hoveredCounty
          )}
        </div>
      </div>
    );

    leftContent = (
      <LMTaiwanMap
        onCountyHover={countyType => {
          setHoveredCounty(countyType);
        }}
      />
    );
  } else {
    // When a county is selected, we show its map and projects
    const countyMapDefaults = CountyMapDefaults[county];

    leftContent = (
      <div id="mapWrap">
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBBNbSvm6YtuprugNWiUGxFuEYYAJK36cw" }}
          defaultCenter={countyMapDefaults.center}
          defaultZoom={countyMapDefaults.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
        ></GoogleMapReact>
      </div>
    );

    rightContent = (
      <>
        <LMCountySelector selectedCounty={county} />
        {/* Only showing the search bar when there's more than three options */}
        {documents.length > 3 && (
          <input
            placeholder="Search for Social Housing Projects..."
            type="text"
            value={searchTerm}
            onInput={e => setSearchTerm(e.target.value)}
          />
        )}
        <div className="collection">
          {documents.map(({ id, name }) => {
            if (
              debounceSearchTerm !== "" &&
              name.indexOf(debounceSearchTerm) < 0
            ) {
              return null;
            }

            return <LMProjectRow id={id} county={county} name={name} />;
          })}
        </div>
      </>
    );
  }

  return (
    <>
      <LMNavBar />
      <div id="root">
        <div id="left">{leftContent}</div>
        <div id="right">
          <div class="marginTop-20 scroll">{rightContent}</div>
        </div>
      </div>
    </>
  );
}

let domContainer = document.querySelector("#lm_county_root");
ReactDOM.render(<LMCountyRoot />, domContainer);
