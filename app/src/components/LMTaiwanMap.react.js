import React from "react";

const MAP_WIDTH = 800;
const MAP_HEIGHT = 680;

export default function LMTaiwanMap() {
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
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      >
        <g className="countries">
          {taiwanData.map((d, i) => (
            <path
              key={`path-${i}`}
              d={d3.geoPath().projection(myProjection())(d)}
              className="country"
              fill={`white`}
              stroke="#FFFFFF"
              strokeWidth={0.5}
            />
          ))}
          {taiwanData.map((d, i) => (
            <path
              key={`path-${i}`}
              d={d3.geoPath().projection(myProjection())(d)}
              className="country"
              fill={`rgba(219, 163, 43,${(1 / taiwanData.length) * i})`}
              stroke="#FFFFFF"
              strokeWidth={0.5}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
