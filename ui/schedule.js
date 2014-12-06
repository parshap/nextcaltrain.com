// jshint newcap:false, camelcase:false
"use strict";

var xtend = require("xtend");
var React = require("react");
var el = React.createElement;
var caltrain = require("caltrain-schedule");
var stations = require("../stations.json");
var getStopName = require("./get-stop-name");

function getFirstStop(scheduledTrip) {
  return scheduledTrip.tripStops[0];
}

function getLastStop(scheduledTrip) {
  return scheduledTrip.tripStops[scheduledTrip.tripStops.length - 1];
}

// ## Format Time
//

function formatTime(date) {
  return [
    formatHours(date.getHours()),
    ":",
    formatMinutes(date.getMinutes()),
    " ",
    getAmPm(date),
    formatOptionalDate(date),
  ].join("");
}

function formatOptionalDate(date) {
  if ( ! isSameDay(date, new Date())) {
    return "*";
  }
}

function isSameDay(date1, date2) {
  return date1.getYear() === date2.getYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDay() === date2.getDay();
}

function getAmPm(date) {
  if (date.getHours() > 12) {
    return "PM";
  }
  else {
    return "AM";
  }
}

function formatHours(hours) {
  if (hours > 12) {
    hours -= 12;
  }
  if (hours === 0) {
    hours = 12;
  }
  return String(hours);
}

function formatMinutes(minutes) {
  return padTimePart(String(minutes));
}

function padTimePart(part) {
  if (part.length < 2) {
    return "0" + part;
  }
  return part;
}

// ## Format Duration

function formatDuration(ms) {
  var minutes = ms / 1000 / 60;
  return Math.round(minutes) + " min";
}

// ## Item - Scheduled stop

function renderTime(props) {
  return el("time", xtend({
    style: {
      "font-weight": "bolder",
    },
  }, props));
}

function renderTrainName(props) {
  return el("span", xtend({
  }, props));
}

var Item = React.createClass({
  getTrainName: function() {
    var scheduledTrip = this.props.scheduledTrip;
    var firstTripStop = getFirstStop(scheduledTrip);
    var headsign = firstTripStop.stop.platform_code;
    return scheduledTrip.route.route_long_name + " " +
      headsign + scheduledTrip.trip.trip_short_name;
  },

  getTripDuration: function() {
    var scheduledTrip = this.props.scheduledTrip;
    var firstTripStop = getFirstStop(scheduledTrip);
    var lastTripStop = getLastStop(scheduledTrip);
    return formatDuration(lastTripStop.date - firstTripStop.date);
  },

  getTripStopsCount: function() {
    return this.props.scheduledTrip.tripStops.length;
  },

  render: function() {
    var scheduledTrip = this.props.scheduledTrip;
    var firstStopDate = getFirstStop(scheduledTrip).date;
    return el("div", {
      style: this.props.style,
      children: [
        renderTime({
          dateTime: firstStopDate.toISOString(),
          children: formatTime(firstStopDate),
        }),
        " ",
        renderTrainName({
          children: this.getTrainName(),
        }),
      ],
    });
  },
});

// ## Exports - Schedule (List of scheduled stops)
//

module.exports = React.createClass({
  getDepartingStationName: function() {
    return getStopName(getFirstStop(this.props.schedule[0]).station);
  },

  render: function() {
    return el("div", {
      children: [
        this.renderHeading(),
        this.renderSchedule(),
      ],
    });
  },

  renderHeading: function() {
    return el("h2", {
      children: [
        "Departures from ",
        el("em", null, this.getDepartingStationName()),
      ],
    });
  },

  renderSchedule: function() {
    return this.props.schedule.map(function(scheduledTrip) {
      return Item({
        scheduledTrip: scheduledTrip,
        style: {
          "margin-bottom": ".5rem",
        },
      });
    });
  },
});
