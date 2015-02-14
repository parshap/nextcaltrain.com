// jshint newcap:false, camelcase:false
"use strict";

var xtend = require("xtend");
var React = require("react");
var el = React.createElement;
var getStopName = require("./get-stop-name");
var TripHeader = require("./trip-header");
var renderBoardTime = require("./board-time");
var DateEl = require("./date");

var StopMarker = React.createClass({
  render: function() {
    return el("div", {
      className: "dim",
      "aria-hidden": true,
      style: xtend({
        "background-color": "#f5f5f5",
        "width": this.props.size,
        "height": this.props.size,
      }, this.props.style),
    });
  },
});

var MARKER_SIZE_LARGE = "0.6rem";
var MARKER_SIZE_SMALL = "0.4rem";

var TripStop = React.createClass({
  displayName: "TripStop",

  getMarkerSize: function() {
    if (this.props.isFirst || this.props.isLast) {
      return MARKER_SIZE_LARGE;
    }
    else {
      return MARKER_SIZE_SMALL;
    }
  },

  render: function() {
    var tripStop = this.props.tripStop;
    return el("section", {
      style: {
        position: "relative",
        "margin": "0.3rem 0",
      },
      children: [
        el("span", {
          style: {
            "display": "inline-block",
            "width": MARKER_SIZE_LARGE,
            "text-align": "center",
            "margin-right": "0.5rem",
          },
          children: el(StopMarker, {
            size: this.getMarkerSize(),
            style: {
              "display": "inline-block",
              "vertical-align": "middle",
              "margin-top": "-0.2rem",
            },
          }),
        }),
        renderBoardTime({
          date: tripStop.date,
        }),
        " ",
        renderStationName({
          station: tripStop.station,
        }),
      ],
    });
  },
});

function renderStationName(props) {
  return el("span", {
    children: getStopName(props.station),
  });
}

module.exports = React.createClass({
  displayName: "ScheduledTripDetails",

  render: function() {
    return el("article", {
      style: this.props.style,
      children: [
        this.renderDate(),
        this.renderHeader(),
        this.renderStops(),
      ],
    });
  },

  renderDate: function() {
    return el(DateEl, {
      className: "board-font",
      style: {
        "display": "block",
        "margin": "1rem 1rem 0.5rem 1rem",
      },
      date: this.props.trip.tripStops[0].date,
    });
  },

  renderHeader: function() {
    return el(TripHeader, {
      style: {
        "width": "18rem",
        "margin": "1rem 1rem 1rem 1rem",
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
      className: "board-font",
      style: {
        padding: "0 1rem",
      },
      children: trips,
    });
  },
});
