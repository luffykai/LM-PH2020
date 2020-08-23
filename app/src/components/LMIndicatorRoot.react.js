"use strict";

import ReactDOM from "react-dom";
import LMNavBar from "./LMNavBar.react";
import React from "react";
import fullData from "../../public/data/full.json";
import LMIndicatorTenderNameLength from "./LMIndicatorTenderNameLength.react";

function SolidDivider() {
  return <div className="solid-divider"></div>;
}

function DottedDivider() {
  return <div className="dotted-divider"></div>;
}

function LMIndicatorRoot() {
  return (
    <>
      <LMNavBar />

      <div id="root">
        <div id="root-bg">
          <div className="container">
            {/* Placeholder diff to make space for h2 title */}
            <div style={{ height: "40px", width: "100%" }} />
            <h2>Social Housing Procurement Environment Indicators</h2>

            <h3>Social Housing Cases</h3>
            <div id="social-housing-number-chart"></div>
            <div id="social-housing-indicator-context"></div>

            <h4>
              There following are 8 indicators to measure the quality of
              bidding:
            </h4>
            <div id="indicator-axis">
              <div className="indicator-axis-column">
                <div className="indicator-axis-name">Market Opportunity</div>
                <div className="indicator-axis-anchor">
                  Median Number of Bidders
                </div>
              </div>
              <div className="indicator-axis-column">
                <div className="indicator-axis-name">Internal Efficiency</div>
                <div className="indicator-axis-anchor">
                  Length of Tender Period
                </div>
                <div className="indicator-axis-anchor">
                  Days from tender close to award decision
                </div>
                <div className="indicator-axis-anchor">
                  Days between award date and tender start date
                </div>
              </div>
              <div className="indicator-axis-column">
                <div className="indicator-axis-name">Value for Money</div>
                <div className="indicator-axis-anchor">
                  Percent of contracts that exceed budget
                </div>
              </div>
              <div className="indicator-axis-column">
                <div className="indicator-axis-name">Public Integrity</div>
                <div className="indicator-axis-anchor">
                  Percent of tenders that do not specify date of delivery
                </div>
                <div className="indicator-axis-anchor">
                  Percent of tenders with fewer than 10 characters in the title
                </div>
              </div>
            </div>

            {/* Data Section starts here */}
            <div id="data-section-1"></div>
            <SolidDivider />

            {/* <DottedDivider /> */}
            <LMIndicatorTenderNameLength fullData={fullData} />
          </div>
        </div>
      </div>
    </>
  );
}

let domContainer = document.querySelector("#lm_indicator_root");
ReactDOM.render(<LMIndicatorRoot />, domContainer);
