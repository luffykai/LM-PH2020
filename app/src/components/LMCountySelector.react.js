import React from "react";
import CountyTypes from "../javascripts/utils/CountyTypes";

export default function LMCountySelector({ selectedCounty }) {
  const dropdownButtonLabel =
    selectedCounty == null ? "Taiwan" : countyNameFormatter(selectedCounty);

  return (
    <div>
      <a class="dropdown-trigger btn" href="#" data-target="county-dropdown">
        {dropdownButtonLabel}
        <i class="material-icons right">keyboard_arrow_down</i>
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
