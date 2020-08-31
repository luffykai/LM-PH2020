import React from "react";
import CountyTypes from "../javascripts/utils/CountyTypes";

const COUNTIES = new Set([...Object.values(CountyTypes)]);

const MAP_WIDTH = 800;
const MAP_HEIGHT = 680;

export default function LMTaiwanMap({
  onCountyHover /* : (CountyTypes) => void */,
}) {
  const dataDiv = document.getElementById("county-map-data");
  let taiwanData = JSON.parse(dataDiv.getAttribute("mapData"));
  taiwanData = topojson.feature(
    taiwanData,
    taiwanData.objects.COUNTY_MOI_1090727
  ).features;

  const myProjection = () => {
    return d3
      .geoMercator()
      .scale(10000)
      .center([121, 24.3])
      .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2.5]);
  };

  return (
    <div>
      <svg
        className="map-svg"
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        viewBox={`0 60 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      >
        <g
          className="countries"
          onMouseOut={() => {
            onCountyHover(null);
          }}
        >
          {taiwanData.map((d, i) => (
            <path
              key={`path-${i}`}
              d={d3.geoPath().projection(myProjection())(d)}
              className="country"
              fill={`white`}
              stroke="#FFFFFF"
              strokeWidth={0.8}
            />
          ))}
          {taiwanData.map((d, i) => (
            <path
              key={`path-${i}`}
              d={d3.geoPath().projection(myProjection())(d)}
              className="country"
              fill={`rgba(56, 190, 121, ${0.2 + (0.8 / taiwanData.length) * i})`}
              stroke="#FFFFFF"
              strokeWidth={2}
              onMouseOver={() => {
                const countyName = d.properties.COUNTYENG;
                const countyType = getLMCountyTypes(countyName);
                onCountyHover && onCountyHover(countyType);
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

// The name we're using in the geo data has different name for counties compared to
// our countyTypes. Casting them here.
function getLMCountyTypes(rawCountyString) {
  const noCityCountyName = rawCountyString.replace(/[Cc]ity/g, "").trim();
  const noCountyCountyName = noCityCountyName.replace(/[Cc]ounty/g, "").trim();
  const castedResult = noCountyCountyName.replace(" ", "_").toLowerCase();

  if (!COUNTIES.has(castedResult)) {
    // console.error(`${castedResult} is not in CountyTypes`);
    return null;
  }

  return castedResult;
}
