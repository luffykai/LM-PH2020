"use strict";

function WorldMap() {
  const dataDiv = document.getElementById("county-map-data");
  let worlddata = JSON.parse(dataDiv.getAttribute('data')); //worlddata = worlddata.objects.countries;

  worlddata = topojson.feature(worlddata, worlddata.objects.countries).features;
  console.log(worlddata);

  const myProjection = () => {
    return d3.geoMercator().scale(1000).center([125.9605, 26.6978]);
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("svg", {
    className: "map-svg",
    width: 800,
    height: 600,
    viewBox: "0 0 800 600"
  }, /*#__PURE__*/React.createElement("g", {
    className: "countries"
  }, worlddata.map((d, i) => /*#__PURE__*/React.createElement("path", {
    key: `path-${i}`,
    d: d3.geoPath().projection(myProjection())(d),
    className: "country",
    fill: `rgba(219, 163, 43,${1 / worlddata.length * i})`,
    stroke: "#FFFFFF",
    strokeWidth: 0.5
  })))));
}

function LMCountyRoot() {
  const dataDiv = document.getElementById("county-map-data");
  const data = JSON.parse(dataDiv.getAttribute("data"));
  const county = dataDiv.getAttribute("county");

  if (data == null) {
    throw "data is null in LWICountyRoot";
  }

  if (county == null) {
    throw "county is null in LWICountyRoot";
  }

  console.log("data", data);
  return /*#__PURE__*/React.createElement("div", null, "LMCountyRoot: ", county, "aaaaa", /*#__PURE__*/React.createElement(WorldMap, null));
}

let domContainer = document.querySelector("#lm_county_root");
ReactDOM.render( /*#__PURE__*/React.createElement(LMCountyRoot, null), domContainer); //let domContainer2 = document.querySelector('#county_map_data');
//ReactDOM.render(<WorldMap />, domContainer2);

module.exports = LMCountyRoot;