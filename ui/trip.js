// jshint newcap:false, camelcase:false
"use strict";

var xtend = require("xtend");
var React = require("react");
var el = React.createElement;
var getStopName = require("./get-stop-name");
var formatTime = require("../lib/time-utils").formatTime;
var TripHeader = require("./trip-header");

function rem(val) {
  return String(val) + "rem";
}

var StopCircle = React.createClass({
  render: function() {
    return el("div", {
      "aria-hidden": true,
      style: xtend({
        "background-color": "#f5f5f5",
        "width": rem(this.props.size),
        "height": rem(this.props.size),
        "border-radius": rem(this.props.size/2),
      }, this.props.style),
    });
  },
});

var TripStop = React.createClass({
  displayName: "TripStop",

  getCircleSize: function() {
    if (this.props.isFirst || this.props.isLast) {
      return 1.2;
    }
    else {
      return 0.8;
    }
  },

  render: function() {
    var tripStop = this.props.tripStop;
    return el("section", {
      style: {
        position: "relative",
        "margin": "0.3rem 0",
        "padding-left": "1.5rem",
      },
      children: [
        el(StopCircle, {
          size: this.getCircleSize(),
          style: {
            "position": "absolute",
            "left": 0,
            "top": "50%",
            "margin-top": rem(-this.getCircleSize()/2)
          },
        }),
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
      children: [
        this.renderHeader(),
        this.renderStops(),
      ],
    });
  },

  renderHeader: function() {
    return el(TripHeader, {
      style: {
        "width": "18rem",
        "padding": "1rem",
      },
      scheduledTrip: this.props.trip,
    });
  },

  renderStops: function() {
    var trip = this.props.trip;
    var trips = trip.tripStops.map(function(tripStop, i) {
      return el(TripStop, {
        tripStop: tripStop,
        isFirst: i === 0,
        isLast: i === trip.tripStops.length - 1,
      });
    });
    return el("div", {
      style: {
        padding: "0 1rem",
      },
      children: trips,
    });
  },
});
