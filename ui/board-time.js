"use strict";

var React = require("react");
var el = React.createElement;
var formatHours = require("../lib/time-utils").formatHours;
var formatMinutes = require("../lib/time-utils").formatMinutes;
var getAmPm = require("../lib/time-utils").getAmPm;

module.exports = function(props) {
  var date = props.date;
  return el("time", {
    style: props.style,
    dateTime: date.toISOString(),
    title: props.title,
    children: [
      renderBoardHours(date.getHours()),
      ":",
      formatMinutes(date.getMinutes()),
      el("span", {
        className: "dim",
        style: {
          "margin-left": ".4em",
          "font-size": "65%",
          "text-transform": "uppercase",
        },
        children: getAmPm(date),
      }),
    ],
  });
};

function renderBoardHours(hours) {
  hours = formatHours(hours);
  if (hours.length < 2) {
    return el("span", {
      dangerouslySetInnerHTML: {
        __html: "0" + hours,
      },
    });
  }
  else {
    return hours;
  }
}
