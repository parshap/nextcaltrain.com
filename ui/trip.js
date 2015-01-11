"use strict";

var xtend = require("xtend");
var React = require("react");
var el = React.createElement;
var getStopName = require("./get-stop-name");
var formatTime = require("../lib/time-utils").formatTime;

var TripStop = React.createClass({
  displayName: "TripStop",

  render: function() {
    var tripStop = this.props.tripStop;
    return el("section", {
      children: [
        renderTime({
          dateTime: tripStop.date.toISOString(),
          children: formatTime(tripStop.date),
          title: formatTripStopTitle(tripStop),
        }),
        " ",
        renderStationName({
          station: tripStop.station,
        }),
      ],
    });
  },
});

function renderTime(props) {
  return el("time", xtend({
    style: xtend({
      "font-weight": "bolder",
    }, props),
  }, props));
}

function renderStationName(props) {
  return el("span", {
    children: getStopName(props.station),
  });
}

function formatTripStopTitle(tripStop) {
  return [
    "Arrive: ",
    formatTime(tripStop.date),
    "\nDeparrt: ",
    formatTime(tripStop.date),
    "\nStopped for: 3 min",
  ].join("");
}

module.exports = React.createClass({
  displayName: "ScheduledTripDetails",

  render: function() {
    return el("div", {
      style: this.props.style,
      children: this.renderStops(),
    });
  },

  renderStops: function() {
    var trip = this.props.trip;
    return trip.tripStops.map(function(tripStop) {
      return el(TripStop, {
        tripStop: tripStop
      });
    });
  },
});
