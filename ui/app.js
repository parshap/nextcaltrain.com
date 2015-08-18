"use strict";

var React = require("react");
var el = React.createElement;
var xtend = require("xtend");
var RouteSelector = require("./route-selector");
var Schedule = require("./schedule");
var Trip = require("./trip");
var TwoColumn = require("./two-column");
var Responsive = require("./responsive");

var PANE_SIZE = 320;
var MARGIN_SIZE = 24;
var MIN_BIG_SIZE = PANE_SIZE * 2 + MARGIN_SIZE;

module.exports = React.createClass({
  handleTripSelect: function(trip) {
    this.props.dispatch("select-trip", trip);
  },

  handleTripUnselect: function() {
    this.props.dispatch("select-trip", null);
  },

  render: function() {
    return el(Responsive.Window, {
      renderChildren: function(state) {
        if (state.width >= MIN_BIG_SIZE) {
          return this.renderTwoColumn();
        }
        else {
          return this.renderOneColumn();
        }
      }.bind(this),
    });
  },

  renderTwoColumn: function() {
    return el(TwoColumn, {
      style: {
        "height": "100%",
        "width": "100%",
        "max-width": MIN_BIG_SIZE + "px",
        "margin": "0 auto",
      },
      leftStyle: {
        "width": PANE_SIZE,
      },
      leftChildren: this.renderScheduleSection(),
      rightChildren: this.renderSelectedTrip(),
    });
  },

  renderOneColumn: function() {
    return el("div", {
     style: {
       width: PANE_SIZE,
       margin: "0 auto",
     },
     children: this.renderScheduleSection({
       shouldExpand: true,
     }),
    });
  },

  renderScheduleSection: function(props) {
    return [
      el(RouteSelector, {
        style: {
          margin: "1.5rem 1rem 1rem 1rem",
        },
        route: this.props.state.get("route").toJS(),
        onChange: this.props.dispatch.bind(null, "change-route"),
      }),
      this.renderSchedule(props),
    ];
  },

  renderSchedule: function(props) {
    var schedule = this.props.state.get("schedule");
    if (schedule) {
      return el(Schedule, xtend({
        style: {
          margin: "0 0 1.5rem 0",
        },
        schedule: schedule,
        selectedTrip: this.props.state.get("selectedTrip"),
        onTripSelect: this.handleTripSelect,
        onTripUnselect: this.handleTripUnselect,
      }, props));
    }
  },

  renderSelectedTrip: function() {
    var trip = this.props.state.get("selectedTrip");
    if (trip) {
      return el(Trip, {
        trip: trip,
        style: {
          margin: "1.5rem 0 1.5rem 1.5rem",
        },
      });
    }
  },
});
