"use strict";

var React = require("react");
var el = React.createElement;
var RouteSelector = require("./route-selector");
var Schedule = require("./schedule");
var Trip = require("./trip");
var TwoColumn = require("./two-column");
var Responsive = require("./responsive");

var PANE_SIZE = 320;

module.exports = React.createClass({
  render: function() {
    return el(TwoColumn, {
      style: {
        "height": "100%",
        "width": "100%",
        "max-width": "664px",
        "margin": "0 auto",
      },
      leftStyle: {
        "width": PANE_SIZE,
      },
      leftChildren: this.renderScheduleSection(),
      rightChildren: el(Responsive, {
        cases: [function(size) {
          if (size.width >= PANE_SIZE) {
            return this.renderSelectedTrip();
          }
        }.bind(this)],
      }),
    });
  },

  renderScheduleSection: function() {
    return [
      el(RouteSelector, {
        style: {
          margin: "1.5rem 1rem 1rem 1rem",
        },
        route: this.props.state.get("route").toJS(),
        onChange: this.props.dispatch.bind(null, "change-route"),
      }),
      this.renderSchedule(),
    ];
  },

  renderSchedule: function() {
    var schedule = this.props.state.get("schedule");
    if (schedule) {
      return el(Schedule, {
        style: {
          margin: "0 0 1.5rem 0",
        },
        schedule: schedule,
        selectedTrip: this.props.state.get("selectedTrip"),
        dispatch: this.props.dispatch,
      });
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
