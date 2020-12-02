import React, { useEffect, useRef } from "react";
import Chartist from "chartist";

const PLACEHOLDER_CHART_DATA = {
  // A labels array that can contain any sort of values
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  // Our series array that contains series objects or in this case series data arrays
  series: [[5, 2, 4, 2, 0]],
};

// Base Component For each of the metrics
export default function LMIndicatorSection({
  id, // id for href to scroll to
  indicator, // e.g. 6.4%, 3.6, 64
  indicatorSuffix, // string
  description, // string, reasoning of why importance of the metrics
  definition, // React.Node Left Middle Rect. in the mock
  chartData, // {labels: [], series: [[12,2,4]]}
  exampleTitle, // string
  exampleSection, // React.Node
  // key, // string for uz
}) {
  const chartRef = useRef(null);
  useEffect(() => {
    new Chartist.Line(
      chartRef.current,
      chartData != null ? chartData : PLACEHOLDER_CHART_DATA
    );
  }, []);

  return (
    <div
      id={id}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {/* metrics + description */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          height: 140,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 115,
            fontWeight: 600,
            height: "100%",
            width: 260,
          }}
        >
          <div>{indicator}</div>
          <div style={{ fontSize: 32, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                lineHeight: "20px",
                fontSize: 20,
              }}
            >
              {indicatorSuffix}
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#fce8f4",
            borderRadius: 10,
            border: "1px solid #f8bbd0",
            color: "#ff80ab",
            height: "100%",
            fontSize: 15,
            fontWeight: 500,
            padding: "17px 22px",
            width: 640,
          }}
        >
          {description}
        </div>
      </div>

      {/* definition + chart */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: 142,
          width: "100%",
        }}
      >
        {
          <div
            style={{
              backgroundColor: definition != null ? "white" : "transparent",
              border: definition != null ? "1px solid #f8bbd0" : "",
              borderRadius: 10,
              height: "100%",
              // width: 355,
              minWidth: 400,
              padding: 4,
            }}
          >
            {definition}
          </div>
        }
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #f8bbd0",
            borderRadius: 10,
            height: "100%",
            width: 640,
          }}
        >
          <div ref={chartRef} />
        </div>
      </div>

      {/* title + examples */}
      {/* <div>
        <h5>
          {exampleTitle != null
            ? exampleTitle
            : "Tender/ item types with lowest number of bidders: "}
        </h5>
        <div
          style={{
            backgroundColor: "rgba(255, 128, 171, 0.4)",
            border: "1px solid #ff4081",
            borderRadius: 10,
            height: 180,
          }}
        ></div>
      </div> */}
    </div>
  );
}
