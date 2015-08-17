// # Selected Indicator
//
// Renders a colored line at the top of its parent element. The parent should
// have "position: relative".
//
"use strict";

var React = require("react");
var el = React.createElement;
var colors = require("./colors");

module.exports = React.createClass({
  displayName: "SelectedIndicator",

  render: function() {
    var style = {
      position: "absolute",
      width: "100%",
      height: "0.5rem",
      top: 0,
      left: 0,
      "background-color": colors.selected,
    };
    return el("div", {
      "aria-hidden": true,
      style: style,
    });
  },
});
