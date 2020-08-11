"use strict";

import LMMap from './LMMap.react';

function LMAppRoot() {
  return (
    <div className="root">
      <div className="container">
        <div className="title"><h1 className="lm-pink-text-1">Social <br /> Housing Map</h1></div>
        <h4 className="marginTop-20">An informative tool for both the public and <br />
            government officials</h4>
        <div className="marginTop-20">
            <a className="btn-large lm-pink-1">I'm 監督者</a>
            <a className="btn-large lm-pink-1 marginLeft-8">I'm Officials</a>
        </div>
        <LMMap />
      </div>
    </div>
  );
}

let domContainer = document.querySelector("#lm_app_root");
ReactDOM.render(<LMAppRoot />, domContainer);
