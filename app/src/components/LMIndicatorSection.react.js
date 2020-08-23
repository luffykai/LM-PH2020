import React from "react";

// Base Component For each of the metrics
export default function LMIndicatorSection({
  indicator, // e.g. 6.4%, 3.6, 64
  indicatorSuffix, // string
  description, // string, reasoning of why importance of the metrics
  definition, // React.Node Left Middle Rect. in the mock
  dataPointArray, // [{year: number, value: number}, ...]
  exampleTitle, // string
  exampleSection, // React.Node
}) {
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
          height: 70,
          width: "100%",
        }}
      >
        <div style={{ backgroundColor: "white", height: "100%", width: 260 }} />
        <div style={{ backgroundColor: "gray", height: "100%", width: 570 }} />
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
        <div style={{ backgroundColor: "gray", height: "100%", width: 570 }} />
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
