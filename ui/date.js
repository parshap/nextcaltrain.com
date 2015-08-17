"use strict";

var React = require("react");
var el = React.createElement;
var DAY_NAMES = require("../lib/time-utils").DAY_NAMES;
var MONTH_NAMES = require("../lib/time-utils").MONTH_NAMES;

module.exports = React.createClass({
  displayName: "Date",

  propTypes: {
    date: React.PropTypes.object.isRequired,
  },

  render: function() {
    var date = this.props.date;
    return el("time", {
      className: this.props.className,
      style: this.props.style,
      datetime: date,
      children: [
        DAY_NAMES[date.getDay()],
        " ",
        MONTH_NAMES[date.getMonth()],
        " ",
        date.getDate(),
        ", ",
        date.getFullYear(),
      ],
    });
  },
});
