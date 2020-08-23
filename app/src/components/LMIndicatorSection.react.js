import React, { useEffect, useRef } from "react";
import Chartist from "chartist";

// Base Component For each of the metrics
export default function LMIndicatorSection({
  indicator, // e.g. 6.4%, 3.6, 64
  indicatorSuffix, // string
  description, // string, reasoning of why importance of the metrics
  definition, // React.Node Left Middle Rect. in the mock
  dataPointArray, // [{year: number, value: number}, ...]
  exampleTitle, // string
  exampleSection, // React.Node
  // key, // string for uz
}) {
  const data = {
    // A labels array that can contain any sort of values
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    // Our series array that contains series objects or in this case series data arrays
    series: [[5, 2, 4, 2, 0]],
  };

  const chartRef = useRef(null);
  useEffect(() => {
    new Chartist.Line(chartRef.current, data);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: 430,
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
            <div style={{ position: "absolute", bottom: 0 }}>
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
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #f8bbd0",
            borderRadius: 10,
            height: "100%",
            width: 355,
          }}
        />
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
      <div>
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
      </div>
    </div>
  );
}
