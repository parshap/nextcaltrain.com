// jshint newcap:false, camelcase:false
"use strict";

var xtend = require("xtend");
var React = require("react");
var el = React.createElement;
var getStopName = require("./get-stop-name");
var TripHeader = require("./trip-header");
var getFirstStop = require("./schedule-util").getFirstStop;
var getLastStop = require("./schedule-util").getLastStop;
var colors = require("./colors");

// ## Scheduled Trip

var ScheduledTrip = React.createClass({
  displayName: "ScheduledTrip",

  getTripStopsCount: function() {
    return this.props.scheduledTrip.tripStops.length;
  },

  render: function() {
    var scheduledTrip = this.props.scheduledTrip;
    return el("article", {
      style: xtend({
        "padding": "1.5rem 1rem",
        "border-top": "1px solid " + colors.dim,
      }, this.props.style),
      children: [
        TripHeader({
          scheduledTrip: scheduledTrip,
        }),
      ],
    });
  },
});

// ## Exports - Schedule (List of scheduled stops)
//

module.exports = React.createClass({
  displayName: "Schedule",

  getDepartingStationName: function() {
    return getStopName(getFirstStop(this.props.schedule[0]).station);
  },

  getArrivingStationName: function() {
    return getStopName(getLastStop(this.props.schedule[0]).station);
  },

  render: function() {
    return el("article", {
      children: [
        this.renderSchedule(),
      ],
    });
  },

  renderSchedule: function() {
    return this.props.schedule.map(function(scheduledTrip) {
      return ScheduledTrip({
        scheduledTrip: scheduledTrip,
      });
    });
  },
});
