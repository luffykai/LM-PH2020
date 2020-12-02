"use strict";

import ReactDOM from "react-dom";
import LMNavBar from "./LMNavBar.react";
import React from "react";
import fullData from "../../public/data/full-0830.json";
import LMIndicatorExceedBudget from "./LMIndicatorExceedBudget.react";
import LMIndicatorTenderNameLength from "./LMIndicatorTenderNameLength.react";
import LMIndicatorMedianBidder from "./LMIndicatorMedianBidder.react";
import LMIndicatorTenderStartToAward from "./LMIndicatorTenderStartToAward.react";
import LMIndicatorNoDeliveryDate from "./LMIndicatorNoDeliveryDate";
import LMIndicatorTenderCloseToAward from "./LMIndicatorTenderCloseToAward.react";

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
            <div id="indicator-title">- Social Housing Indicators -</div>

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
                  <a href="#median-bidder">Median Number of Bidders</a>
                </div>
              </div>
              <div className="indicator-axis-column">
                <div className="indicator-axis-name">Internal Efficiency</div>
                <div className="indicator-axis-anchor">
                  Length of Tender Period
                </div>
                <div className="indicator-axis-anchor">
                  <a href="#tender-close-to-award">
                    Days from tender close to award decision
                  </a>
                </div>
                <div className="indicator-axis-anchor">
                  <a href="#tender-start-to-award">
                    Days between award date and tender start date
                  </a>
                </div>
              </div>
              <div className="indicator-axis-column">
                <div className="indicator-axis-name">Value for Money</div>
                <div className="indicator-axis-anchor">
                  <a href="#exceed-budget">
                    Percent of contracts that exceed budget
                  </a>
                </div>
              </div>
              <div className="indicator-axis-column">
                <div className="indicator-axis-name">Public Integrity</div>
                <div className="indicator-axis-anchor">
                  <a href="#no-delivery">
                    Percent of tenders that do not specify date of delivery
                  </a>
                </div>
                <div className="indicator-axis-anchor">
                  <a href="#tender-name">
                    Percent of tenders with fewer than 10 characters in the
                    title
                  </a>
                </div>
              </div>
            </div>

            {/* Data Section starts here */}
            <LMIndicatorMedianBidder fullData={fullData} id="median-bidder" />
            <SolidDivider />
            <LMIndicatorTenderStartToAward
              fullData={fullData}
              id="tender-start-to-award"
            />
            <SolidDivider />
            <LMIndicatorTenderCloseToAward
              fullData={fullData}
              id="tender-close-to-award"
            />
            <SolidDivider />
            {/* <DottedDivider /> */}
            <LMIndicatorTenderNameLength fullData={fullData} id="tender-name" />
            <SolidDivider />
            <LMIndicatorExceedBudget fullData={fullData} id="exceed-budget" />
            <SolidDivider />
            <LMIndicatorNoDeliveryDate fullData={fullData} id="no-delivery" />
          </div>
        </div>
      </div>
    </>
  );
}

let domContainer = document.querySelector("#lm_indicator_root");
ReactDOM.render(<LMIndicatorRoot />, domContainer);
