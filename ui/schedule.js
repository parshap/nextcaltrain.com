// jshint newcap:false, camelcase:false
"use strict";

var xtend = require("xtend");
var React = require("react");
var el = React.createElement;
var getStopName = require("./get-stop-name");
var TripHeader = require("./trip-header");
var Trip = require("./trip");
var SelectedIndicator = require("./selected-indicator");
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
    var style ={
      "position": "relative",
      "padding": "1.5rem 0 0 0",
      "border-bottom": "0.25rem solid " + colors.shadow,
      "background": colors.background,
      "margin": "0 0 0.25rem 0",
    };
    if (this.props.isExpanded) {
      style["margin"] = "0 0 0.5rem 0";
    }
    else {
      style["cursor"] = "pointer";
    }
    return xtend(style, this.props.style);
  },

  getHeaderMarginBottom: function() {
    if (this.props.isExpanded) {
      return "1rem";
    }
    else {
      return "1.5rem";
    }
  },

  render: function() {
    return el("article", {
      // @TODO Keyboard
      onClick: this.props.onClick,
      "tabIndex": 0,
      "role": "radiobutton",
      "aria-checked": this.props.isSelected,
      style: this.getStyle(),
      children: [
        el(TripHeader, {
          style: {
            padding: "0 1rem",
            "margin-bottom": this.getHeaderMarginBottom(),
          },
          scheduledTrip: this.props.scheduledTrip,
        }),
        this.renderExpanded(),
        this.renderSelectedIndicator(),
      ],
    });
  },

  renderExpanded: function() {
    if (this.props.isExpanded) {
      return el(Trip.Body, {
        style: {
          margin: "1rem 0 0 0",
        },
        trip: this.props.scheduledTrip,
      });
    }
  },

  renderSelectedIndicator: function() {
    if (this.props.isSelected) {
      return el(SelectedIndicator);
    }
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
      style: this.props.style,
      children: [
        this.renderSchedule(),
      ],
    });
  },

  renderSchedule: function() {
    var props = this.props;
    return this.props.schedule.map(function(trip) {
      var isSelected = trip === props.selectedTrip;
      return el(ScheduledTrip, {
        isSelected: isSelected,
        isExpanded: props.shouldExpand && isSelected,
        scheduledTrip: trip,
        onClick: function(e) {
          e.preventDefault();
          if ( ! isSelected) {
            props.onTripSelect(trip);
          }
        },
      });
    });
  },
});
