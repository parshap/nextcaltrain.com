"use strict";

var React = require("react");
var el = React.createElement;
var SHORT_DAY_NAMES = require("../lib/time-utils").SHORT_DAY_NAMES;
var SHORT_MONTH_NAMES = require("../lib/time-utils").SHORT_MONTH_NAMES;

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
        SHORT_DAY_NAMES[date.getDay()],
        " ",
        SHORT_MONTH_NAMES[date.getMonth()],
        " ",
        date.getDate(),
        " ",
        date.getFullYear(),
      ],
    });
  },
});
