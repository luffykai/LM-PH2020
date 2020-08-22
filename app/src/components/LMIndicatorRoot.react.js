"use strict";

import ReactDOM from "react-dom";
import LMNavBar from "./LMNavBar.react";
import React from "react";


function LMIndicatorRoot() {
  return (
    <>
      <LMNavBar />
      <div className="root" />
    </>
  );
}

let domContainer = document.querySelector("#lm_indicator_root");
ReactDOM.render(<LMIndicatorRoot />, domContainer);
