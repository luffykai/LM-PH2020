import React from "react";
import CountyTypes from "../javascripts/utils/CountyTypes";

const LM_PINK = "#ff4081";

export default function LMCountySelector({ selectedCounty }) {
  const dropdownButtonLabel =
    selectedCounty == null ? "Taiwan" : countyNameFormatter(selectedCounty);

  return (
    <div>
      <a
        class="dropdown-trigger"
        href="#"
        data-target="county-dropdown"
        style={{
          borderBottom: `3px solid ${LM_PINK}`,
          color: LM_PINK,
          fontSize: 44,
          fontWeight: 600,
          letterSpacing: 1,
          paddingBottom: 4,
        }}
      >
        {dropdownButtonLabel}
        <div
          style={{
            backgroundImage: `url(images/triangle.svg)`,
            display: "inline-block",
            width: 42,
            height: 42,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />
      </a>
      <ul id="county-dropdown" class="dropdown-content">
        <li>
          <a href={`/county`}>Taiwan</a>
        </li>
        {Object.values(CountyTypes).map((name) => (
          <li>
            <a href={`/county?name=${name}`}>{countyNameFormatter(name)}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function countyNameFormatter(countyNameRaw) {
  const countyNames = countyNameRaw
    .split("_")
    .map(
      (_namePartRaw) =>
        `${_namePartRaw.slice(0, 1).toUpperCase()}${_namePartRaw.slice(1)}`
    );
  return countyNames.join(" ");
}
