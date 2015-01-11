"use strict";

var React = require("react");
var el = React.createElement;
var xtend = require("xtend");

function renderColumn(props) {
  return el("div", xtend(props, {
    style: xtend({
      "display": "table-cell",
      "vertical-align": "top",
    }, props.style),
  }));
}

module.exports = React.createClass({
  propTypes: {
  },

  render: function() {
    return el("div", {
      style: xtend({
        "display": "table",
        "table-layout": "fixed",
      }, this.props.style),
      children: [
        renderColumn({
          style: this.props.leftStyle,
          children: this.props.leftChildren,
        }),
        renderColumn({
          style: this.props.rightStyle,
          children: this.props.rightChildren,
        }),
      ],
    });
  },
});
