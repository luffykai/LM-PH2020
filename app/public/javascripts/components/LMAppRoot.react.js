"use strict";

function LMAppRoot() {
  return React.createElement(
    "div",
    { className: "root" },
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "h1",
        { className: "lm-pink-text-1 " },
        "Social ",
        React.createElement("br", null),
        " Housing Map"
      ),
      React.createElement(
        "h4",
        null,
        "An informative tool for both the public and ",
        React.createElement("br", null),
        "government officials"
      ),
      React.createElement(
        "div",
        null,
        React.createElement(
          "a",
          { className: "btn-large lm-pink-1" },
          "I'm \u76E3\u7763\u8005"
        ),
        React.createElement(
          "a",
          { className: "btn-large lm-pink-1 marginLeft-8" },
          "I'm Officials"
        )
      )
    )
  );
}

let domContainer = document.querySelector("#lm_app_root");
ReactDOM.render(React.createElement(LMAppRoot, null), domContainer);