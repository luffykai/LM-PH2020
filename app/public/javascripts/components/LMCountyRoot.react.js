"use strict";

function WorldMap() {
  var dataDiv = document.getElementById("county-map-data");
  var worlddata = JSON.parse(dataDiv.getAttribute('mapData')); //worlddata = worlddata.features;

  worlddata = topojson.feature(worlddata, worlddata.objects.COUNTY_MOI_1090727).features;
  var width = 800;
  var height = 680;

  var myProjection = function myProjection() {
    return d3.geoMercator().scale(10000).center([121, 24.3]).translate([width / 2, height / 2.5]);
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("svg", {
    className: "map-svg",
    width: 800,
    height: 680,
    viewBox: "0 0 800 680"
  }, /*#__PURE__*/React.createElement("g", {
    className: "countries"
  }, worlddata.map(function (d, i) {
    return /*#__PURE__*/React.createElement("path", {
      key: "path-".concat(i),
      d: d3.geoPath().projection(myProjection())(d),
      className: "country",
      fill: "rgba(219, 163, 43,".concat(1 / worlddata.length * i, ")"),
      stroke: "#FFFFFF",
      strokeWidth: 0.5
    });
  }))));
}

function LMCountyRoot() {
  var dataDiv = document.getElementById("county-map-data");
  var data = JSON.parse(dataDiv.getAttribute("data"));
  var county = dataDiv.getAttribute("county");

  if (data == null) {
    throw "data is null in LWICountyRoot";
  }

  if (county == null) {
    throw "county is null in LWICountyRoot";
  }

  console.log("data", data);
  return /*#__PURE__*/React.createElement("div", null, "LMCountyRoot: ", county, "aaaaa", /*#__PURE__*/React.createElement(WorldMap, null));
}

var domContainer = document.querySelector("#lm_county_root");
ReactDOM.render( /*#__PURE__*/React.createElement(LMCountyRoot, null), domContainer);