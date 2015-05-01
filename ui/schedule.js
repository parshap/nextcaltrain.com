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

  getBackground: function() {
    if (this.props.isSelected) {
      return colors.selected;
    }
    else {
      return colors.background;
    }
  },

  getStyle: function() {
    return xtend({
      "position": "relative",
      "cursor": "pointer",
      "padding": "1.5rem 1rem",
      "border-bottom": "0.25rem solid " + colors.shadow,
      "background": colors.background,
      "margin": "1rem 0.25rem",
    }, this.props.style);
  },

  render: function() {
    var scheduledTrip = this.props.scheduledTrip;
    return el("article", {
      onClick: this.props.onClick,
      "tabIndex": 0,
      "role": "radiobutton",
      "aria-checked": this.props.isSelected,
      style: this.getStyle(),
      children: [
        TripHeader({
          scheduledTrip: scheduledTrip,
        }),
        this.renderSelectedIndicator(),
      ],
    });
  },

  renderSelectedIndicator: function() {
    if (this.props.isSelected) {
      return el(SelectedIndicator);
    }
  },
});

// ### Selected Indicator

var SelectedIndicator = React.createClass({
  render: function() {
    var style = {
      position: "absolute",
      width: "0.5rem",
      height: "100%",
      top: 0,
      "background-color": colors.selected,
    };
    return el("div", {
      "aria-hidden": true,
      children: [
        el("div", {
          style: xtend(style, {
            left: 0,
          }),
        }),
        el("div", {
          style: xtend(style, {
            right: 0,
          }),
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
      className: this.props.className,
      children: [
        this.renderSchedule(),
      ],
    });
  },

  renderSchedule: function() {
    var dispatch = this.props.dispatch;
    var selectedTrip = this.props.selectedTrip;
    return this.props.schedule.map(function(scheduledTrip) {
      return ScheduledTrip({
        isSelected: scheduledTrip === selectedTrip,
        scheduledTrip: scheduledTrip,
        onClick: function(e) {
          e.preventDefault();
          dispatch("select-trip", scheduledTrip);
        },
      });
    });
  },
});
