!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=1)}([,function(e,t,n){"use strict";function r(){var e=document.getElementById("county-map-data"),t=JSON.parse(e.getAttribute("mapData"));t=topojson.feature(t,t.objects.COUNTY_MOI_1090727).features;return React.createElement("div",null,React.createElement("svg",{className:"map-svg",width:800,height:680,viewBox:"0 0 800 680"},React.createElement("g",{className:"countries"},t.map((function(e,n){return React.createElement("path",{key:"path-".concat(n),d:d3.geoPath().projection(d3.geoMercator().scale(1e4).center([121,24.3]).translate([400,272]))(e),className:"country",fill:"rgba(219, 163, 43,".concat(1/t.length*n,")"),stroke:"#FFFFFF",strokeWidth:.5})})))))}function o(){var e=document.getElementById("county-map-data"),t=JSON.parse(e.getAttribute("data")),n=e.getAttribute("county");if(null==t)throw"data is null in LWICountyRoot";if(null==n)throw"county is null in LWICountyRoot";return console.log("data",t),React.createElement("div",null,"LMCountyRoot: ",n,"aaaaa",React.createElement(r,null))}n.r(t);var a=document.querySelector("#lm_county_root");ReactDOM.render(React.createElement(o,null),a)}]);