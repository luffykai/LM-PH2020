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
import LMCountyTypes from "../javascripts/utils/CountyTypes";
import geoJson from "../../public/data/lm-ph2020-wgs84.geojson";
import { countyNameFormatter } from "../javascripts/utils/CountyNameUtils";
import { useDebounce } from "use-debounce";

const HOUSEHOLD_COUNT_MAP = {
  [LMCountyTypes.HSINCHU]: {
    household: 233,
    project: 1
  },
  [LMCountyTypes.KAOHSIUNG]: {
    household: 1117,
    project: 8
  },
  [LMCountyTypes.KINMEN]: {
    household: 72,
    project: 1
  },
  [LMCountyTypes.LIENCHIANG]: {
    household: 20,
    project: 1
  },
  [LMCountyTypes.NANTOU]: {
    household: 55,
    project: 2
  },
  [LMCountyTypes.NEW_TAIPEI]: {
    household: 10134,
    project: 37
  },
  [LMCountyTypes.PENGHU]: {
    household: 50,
    project: 1
  },
  [LMCountyTypes.TAICHUNG]: {
    household: 6260,
    project: 22
  },
  [LMCountyTypes.TAINAN]: {
    household: 800,
    project: 7
  },
  [LMCountyTypes.TAIPEI]: {
    household: 16833,
    project: 51
  },
  [LMCountyTypes.TAITUNG]: {
    household: 43,
    project: 1
  },
  [LMCountyTypes.TAOYUAN]: {
    household: 9667,
    project: 37
  }
};

const db = firebase.firestore();
const geoLookupMap = (function() {
  const map = new Map();
  for (const feature of geoJson.features) {
    const properties = feature.properties;
    if (properties["案名"] == null) {
      continue;
    }
    let geoData = {};
    if (properties["預定完"] != null) {
      geoData.eta = properties["預定完"];
    }
    if (properties["縣市"] != null) {
      geoData.county = properties["縣市"];
    }
    if (properties["行政區"] != null) {
      geoData.district = properties["行政區"];
    }
    if (properties["地段號"] != null) {
      geoData.address = properties["地段號"];
    }
    if (properties["土地權"] != null) {
      geoData.landlord = properties["土地權"];
    }
    map.set(properties["案名"], geoData);
  }
  return map;
})();

const getCenterOfGeometry = function(maps, geometry) {
  let bounds = new maps.LatLngBounds();
  geometry.forEachLatLng(latlng => {
    bounds.extend(latlng);
  });
  return bounds.getCenter();
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

  const apiIsLoaded = (map, maps) => {
    map.data.addGeoJson(geoJson);
    map.data.setStyle(feature => {
      if (feature.getProperty("階段") === "既有") {
        return {
          visible: false
        };
      }
      return {
        fillColor: "#fb4a78",
        strokeColor: "#f84081",
        strokeWeight: 1
      };
    });
    map.data.addListener("click", event => {
      setSearchTerm(event.feature.getProperty("案名"));
    });
    let infowindow;
    map.data.addListener("mouseover", event => {
      map.data.revertStyle();
      map.data.overrideStyle(event.feature, {
        fillColor: "#f84081",
        strokeWeight: 2
      });
      infowindow = new maps.InfoWindow({
        content: `<b>${event.feature.getProperty("案名")}</b>`,
        position: getCenterOfGeometry(maps, event.feature.getGeometry())
      });
      infowindow.open(map);
    });
    map.data.addListener("mouseout", _event => {
      map.data.revertStyle();
      infowindow.close();
    });
  };

  let rightContent = null;
  let leftContent = null;
  /* undefined will be casted to a string during ssr */
  if (county === "undefined") {
    const currentHouseHold =
      hoveredCounty == null
        ? 45284
        : HOUSEHOLD_COUNT_MAP[hoveredCounty].household;
    const currentProjectCount =
      hoveredCounty == null ? 169 : HOUSEHOLD_COUNT_MAP[hoveredCounty].project;

    // No county is specified, which means we're showing a Taiwan Map.
    rightContent = (
      <div className="rightContent">
        <div>
          {hoveredCounty != null && (
            <div style={{ fontSize: 80 }}>
              {countyNameFormatter(hoveredCounty)}
            </div>
          )}
          <div id="largeMetricAndUnit">
            <div id="largeMetric">{currentHouseHold}</div>
            <span id="unit">
              House <br />
              Number
            </span>
          </div>
          <div id="allCases">
            with {currentProjectCount} housing projects in this area
          </div>
          {hoveredCounty == null && (
            <>
              <h5>Choose the county:</h5>
              <div className="marginTop-8"></div>
              <LMCountySelector selectedCounty={null} />
            </>
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

            return (
              <LMProjectRow
                id={id}
                county={county}
                name={name}
                geoData={geoLookupMap.get(name)}
              />
            );
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
