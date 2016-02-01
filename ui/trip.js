// jshint newcap:false, camelcase:false
"use strict";

var xtend = require("xtend");
var React = require("react");
var el = React.createElement;
var renderBoardTime = require("./board-time");
var SelectedIndicator = require("./selected-indicator");
var TripHeader = require("./trip-header");
var DateEl = require("./date");
var colors = require("./colors");
var getGoogleMapsImageURL = require("./google-maps-image");

var StopMarker = React.createClass({
  render: function() {
    return el("div", {
      "aria-hidden": true,
      style: xtend({
        "background-color": colors.dim,
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

  isFirstOrLast: function() {
    return this.props.isFirst || this.props.isLast;
  },

  getClassName: function() {
    if ( ! this.isFirstOrLast()) {
      return "dim";
    }
  },

  render: function() {
    var tripStop = this.props.tripStop;
    return el("section", {
      className: this.getClassName(),
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
    children: props.station.name,
  });
}

var Body = React.createClass({
  displayName: "ScheduledTripDetails",

  render: function() {
    return el("div", {
      style: this.props.style,
      children: [
        this.renderDate(),
        this.renderStops(),
        this.renderImage(),
      ],
    });
  },

  renderDate: function() {
    return el(DateEl, {
      className: "board-font dim",
      style: {
        "display": "block",
        padding: "0 1rem",
        margin: "0 0 1rem 0",
      },
      date: this.props.trip.tripStops[0].date,
    });
  },

  renderImage: function() {
    var src = getGoogleMapsImageURL(this.props.trip, "320x240");
    return el("img", {
      src: src,
      width: 320,
      height: 240,
      style: {
        display: "block",
      },
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
        margin: "0 0 1rem 0",
      },
      children: trips,
    });
  },
});

module.exports = React.createClass({
  displayName: "ScheduledTripDetails",

  render: function() {
    return el("article", {
      style: xtend({
        width: "320px",
        padding: "1.5rem 0 0 0",
        background: colors.background,
        position: "relative",
      }, this.props.style),
      children: [
        el(TripHeader, {
          style: {
            "box-sizing": "border-box",
            width: "320px",
            padding: "0 1rem",
            margin: "0 0 1rem 0",
          },
          scheduledTrip: this.props.trip,
        }),
        el(Body, {
          trip: this.props.trip,
        }),
        el(SelectedIndicator),
      ],
    });
  },
});

module.exports.Body = Body;
