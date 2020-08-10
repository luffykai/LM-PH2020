"use strict";

var _LMMap = _interopRequireDefault(require("./LMMap.react"));

var _LMTestComponent = _interopRequireDefault(require("./LMTestComponent.react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function LMAppRoot() {
  return /*#__PURE__*/React.createElement("div", {
    className: "root"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "title"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "lm-pink-text-1"
  }, "Social ", /*#__PURE__*/React.createElement("br", null), " Housing Map")), /*#__PURE__*/React.createElement("h4", {
    className: "marginTop-20"
  }, "An informative tool for both the public and ", /*#__PURE__*/React.createElement("br", null), "government officials"), /*#__PURE__*/React.createElement("div", {
    className: "marginTop-20"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn-large lm-pink-1"
  }, "I'm \u76E3\u7763\u8005"), /*#__PURE__*/React.createElement("a", {
    className: "btn-large lm-pink-1 marginLeft-8"
  }, "I'm Officials")), /*#__PURE__*/React.createElement(_LMMap["default"], null), /*#__PURE__*/React.createElement(_LMTestComponent["default"], null)));
}

var domContainer = document.querySelector("#lm_app_root");
ReactDOM.render( /*#__PURE__*/React.createElement(LMAppRoot, null), domContainer);