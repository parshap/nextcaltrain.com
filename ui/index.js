"use strict";

var React = require("react");
var el = React.createElement;
var RouteSelector = require("./route-selector");
var Schedule = require("./schedule");

// var CALTRAIN_RED = "#e22a2a";

var UI = React.createClass({
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
          route: this.props.state.get("route").toJS(),
          onChange: this.props.dispatch.bind(null, "change-route"),
        }),
        this.renderSchedule(),
      ],
    });
  },

  renderSchedule: function() {
    var schedule = this.props.state.get("schedule");
    if (schedule) {
      return el(Schedule, {
        schedule: schedule,
      });
    }
  },
});

// ## URL hash state

var hash = require("hash-change");
var slug = require("to-slug-case");
var getStation = require("../get-station");

function updateHash(route) {
  if ( ! isSameRoute(getRouteFromHash(), route)) {
    setHash(route);
  }
}

function setHash(route) {
  window.location.hash =  getHash(route.from, route.to);
}

function getHash(from, to) {
  if (from && to) {
    return [
      slug(getStation(from).name),
      "-to-",
      slug(getStation(to).name),
    ].join("");
  }
  else if (from) {
    return from + "-to";
  }
  else if (to) {
    return "to-" + to;
  }
  else {
    return "";
  }
}

function getRoute() {
  var route = getRouteFromHash();
  if (route) {
    return route;
  }
  return {
    from: window.localStorage.getItem("from") || "ctsf",
    to: window.localStorage.getItem("to") || "ctsj",
  };
}

function getRouteFromHash() {
  return parseHash(window.location.hash);
}

function parseHash(hash) {
  var parts = hash.slice(1).split(/-to-|-to|to-/, 2);
  var from = getStation(function(station) {
    return slug(station.name) === parts[0];
  });
  var to = getStation(function(station) {
    return slug(station.name) === parts[1];
  });
  return {
    from: from && from.id,
    to: to && to.id,
  };
}

function isSameRoute(route1, route2) {
  return route1 === route2 ||
    (
      route1 &&
      route2 &&
      route1.to === route2.to &&
      route1.from === route2.from
    );
}

// ## Application state

var createState = require("./state");

(function() {
  var state;
  var dispatch = createState(function(newState) {
    state = newState;
    updateHash(state.get("route").toJS());
    React.render(
      React.createElement(UI, {
        state: state,
        dispatch: dispatch,
      }),
      global.document.body
    );
  });

  hash.on("change", function() {
    var route = parseHash(window.location.hash);
    if ( ! isSameRoute(route, state.get("route"))) {
      dispatch("change-route", route);
    }
  });

  // Set initial route
  dispatch("change-route", getRoute());
})();
