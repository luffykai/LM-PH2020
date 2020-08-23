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
        backgroundColor: "red",
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
          height: 86,
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            display: "flex",
            // flexDirection: "column",
            fontSize: 50,
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
            backgroundColor: "gray",
            borderRadius: 4,
            border: "1px solid",
            borderColor: "pink",
            height: "100%",
            padding: 12,
            width: 570,
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
          height: 120,
          width: "100%",
        }}
      >
        <div style={{ backgroundColor: "white", height: "100%", width: 260 }} />
        <div style={{ backgroundColor: "transparent", height: "100%", width: 570 }}>
          <div ref={chartRef} />
        </div>
      </div>
      {/* title + examples */}
      <div>
        <h4>{exampleTitle}</h4>
        <div
          style={{ backgroundColor: "green", borderRadius: 4, height: 125 }}
        ></div>
      </div>
    </div>
  );
}
