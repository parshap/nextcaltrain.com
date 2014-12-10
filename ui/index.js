"use strict";

var React = require("react");
var el = React.createElement;
var caltrain = require("nextcaltrain");
var RouteSelector = require("./route-selector");
var Schedule = require("./schedule");
var hash = require("hash-change");
var slug = require("to-slug-case");
var getStation = require("../get-station");

function getHash(from, to) {
  return [
    slug(getStation(from).name),
    "-to-",
    slug(getStation(to).name),
  ].join("");
}

function getRoute() {
  var route = parseHash(window.location.hash);
  if (route) {
    return route;
  }
  return {
    from: window.localStorage.getItem("from") || "ctsf",
    to: window.localStorage.getItem("to") || "ctsj",
  };
}

function parseHash(hash) {
  var parts = hash.slice(1).split("-to-", 2);
  var from = getStation(function(station) {
    return slug(station.name) === parts[0];
  });
  var to = getStation(function(station) {
    return slug(station.name) === parts[1];
  });
  if (from && to) {
    return {
      from: from.id,
      to: to.id,
    };
  }
}

function isSameRoute(route1, route2) {
  return route1.to === route2.to &&
    route1.from === route2.from;
}

var CALTRAIN_RED = "#e22a2a";

var UI = React.createClass({
  setHash: function(state) {
    if (state.to && state.from && state.to !== state.from) {
      window.location.hash = getHash(state.from, state.to);
    }
    else {
      window.location.hash = "";
    }
  },

  getInitialState: function() {
    return getRoute();
  },

  updateSchedule: function(state) {
    this.setHash(state);
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

  componentDidMount: function() {
    hash.on("change", function() {
      var route = parseHash(window.location.hash);
      if ( ! route) {
        // Invalid hash, reset it
        this.setHash(this.state);
      }
      if ( ! isSameRoute(route, this.state)) {
        this.setState(route);
      }
    }.bind(this));
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
    var storage = this.props.storage;
    // Save to localStorage
    Object.keys(route).forEach(function(name) {
      storage.setItem(name, route[name]);
    });
    this.setState(route);
  },
});

React.renderComponent(
  React.createElement(UI, {
    storage: window.localStorage,
  }),
  global.document.body
);
