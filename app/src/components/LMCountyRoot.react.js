"use strict";

function WorldMap() {

    const dataDiv = document.getElementById("county-map-data");
    let worlddata = JSON.parse(dataDiv.getAttribute('mapData'));
    //worlddata = worlddata.features;
    worlddata = topojson.feature(worlddata, worlddata.objects.COUNTY_MOI_1090727).features;
    let width = 800;
    let height = 680;

    const myProjection = () => {
        return d3.geoMercator()
            .scale(10000)
            .center([121, 24.3])
            .translate([width/2, height/2.5]);
    }

    return (
        <div>
          <svg className="map-svg" width={ 800 } height={ 680 } viewBox="0 0 800 680">
          <g className="countries">
          {
          worlddata.map((d,i) => (
              <path
              key={ `path-${ i }` }
              d={ d3.geoPath().projection(myProjection())(d) }
              className="country"
              fill={ `rgba(219, 163, 43,${ 1 / worlddata.length * i})` }
              stroke="#FFFFFF"
              strokeWidth={ 0.5 }
              />
          ))
          }
          </g>
          </svg>
        </div>
    )
}

export default function LMCountyRoot() {
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

    return <div>
        LMCountyRoot: {county}
        aaaaa
        <WorldMap />
    </div>;
}

let domContainer = document.querySelector("#lm_county_root");
ReactDOM.render(<LMCountyRoot />, domContainer);
