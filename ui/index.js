"use strict";

var React = require("react");
var el = React.createElement;
var caltrain = require("caltrain-schedule");
var RouteSelector = require("./route-selector");
var Schedule = require("./schedule");

var CALTRAIN_RED = "#e22a2a";

var UI = React.createClass({
  getInitialState: function() {
    return {
      from: "ctsf",
      to: "ctsj",
    };
  },

  updateSchedule: function(state) {
    if (state.to && state.from && state.to !== state.from) {
      this.getNextStop = caltrain({
        from: state.from,
        to: state.to,
        date: new Date(),
      });
      this.schedule = [
        this.getNextStop(),
        this.getNextStop(),
        this.getNextStop(),
        this.getNextStop(),
        this.getNextStop(),
        this.getNextStop(),
        this.getNextStop(),
        this.getNextStop(),
        this.getNextStop(),
        this.getNextStop(),
      ];
    }
    else {
      this.getNextStop = null;
      this.schedule = null;
    }
  },

  componentWillMount: function() {
    this.updateSchedule(this.state);
  },

  componentWillUpdate: function(nextProps, nextState) {
    this.updateSchedule(nextState);
  },

  render: function() {
    return el("article", {
      style: {
        "font-size": "16px",
        "max-width": "20rem",
        "font-family": "sans-serif",
      },
      children: [
        el(RouteSelector, {
          style: {
            margin: "1.5rem 1rem",
          },
          to: this.state.to,
          from: this.state.from,
          onChange: this.handleRouteChange,
        }),
        this.renderSchedule(),
      ],
    });
  },

  renderSchedule: function() {
    if (this.schedule) {
      return el(Schedule, {
        schedule: this.schedule,
      });
    }
  },

  handleRouteChange: function(route) {
    this.setState(route);
  },
});

React.renderComponent(
  React.createElement(UI, {
  }),
  global.document.body
);
