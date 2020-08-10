"use strict";

function LMAppRoot() {
  return (
    <div className="root">
      <div className="container">
        <h1 className="lm-pink-text-1 ">Social <br /> Housing Map</h1>
        <h4>An informative tool for both the public and <br />
            government officials</h4>

        <div>
            <a className="btn-large lm-pink-1">I'm 監督者</a>
            <a className="btn-large lm-pink-1 marginLeft-8">I'm Officials</a>
        </div>
      </div>
    </div>
  );
}

let domContainer = document.querySelector("#lm_app_root");
ReactDOM.render(<LMAppRoot />, domContainer);
