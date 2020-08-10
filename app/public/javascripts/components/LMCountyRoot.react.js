"use strict";

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

  return React.createElement(
    "div",
    null,
    "LMCountyRoot: ",
    county
  );
}

let domContainer = document.querySelector("#lm_county_root");
ReactDOM.render(React.createElement(LMCountyRoot, null), domContainer);