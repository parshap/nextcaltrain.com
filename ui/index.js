"use strict";

var Immutable = require("immutable");
var React = require("react");
var App = require("./app");

// ## URL hash state

var hash = require("hash-change");
var slug = require("to-slug-case");
var getStation = require("../get-station");

function getStationSlug(stationId) {
  return slug(getStation(stationId).name);
}

function updateHash(route) {
  if (getCurrentHash() !== getHash(route)) {
    setHash(route);
  }
}

function setHash(route) {
  window.location.hash = getHash(route);
}

function getHash(route) {
  if (route.from && route.to) {
    return [
      getStationSlug(route.from),
      "-to-",
      getStationSlug(route.to),
    ].join("");
  }
  else if (route.from) {
    return getStationSlug(route.from) + "-to";
  }
  else if (route.to) {
    return "to-" + getStationSlug(route.to);
  }
  else {
    return "";
  }
}

var INITIAL_ROUTE_SOURCES = [
  getRouteFromHash,
  getRouteFromStorage,
];

var DEFAULT_ROUTE = {
  from: "ctsf",
  to: "ctsj",
};

function getInitialRoute() {
  var i, route;
  for (i = 0; i < INITIAL_ROUTE_SOURCES.length; i++) {
    route = INITIAL_ROUTE_SOURCES[i]();
    if (hasRoute(route)) {
      return route;
    }
  }
  return DEFAULT_ROUTE;
}

function getRouteFromStorage() {
  return {
    from: getStorageItem("from"),
    to: getStorageItem("to"),
  };
}

// Returns value from localStorage. If no value is present or localStorage is
// not available, `undefined` is returned.
function getStorageItem(name) {
  try {
    return JSON.parse(window.localStorage.getItem(name));
  }
  catch (err) {}
}

function updateStorage(route) {
  // Save to localStorage
  Object.keys(route).forEach(function(name) {
    setStorageItem(name, route[name]);
  });
}

// Writes to localStorage. Fails silently if localStorage is not available.
function setStorageItem(name, value) {
  if (value === undefined) {
    try {
      window.localStorage.removeItem(name);
    }
    catch (err) {}
  }
  else {
    try {
      window.localStorage.setItem(name, JSON.stringify(value || null));
    }
    catch (err) {}
  }
}

function getRouteFromHash() {
  return parseHash(getCurrentHash());
}

function getCurrentHash() {
  return window.location.hash.slice(1);
}

function parseHash(hash) {
  var parts = hash.split(/-to-|-to$|^to-/, 2);
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

function hasRoute(route) {
  return route && (route.from || route.to);
}

// ## Application state

var createState = require("./state");

(function() {
  var state;
  var dispatch = createState(function(newState) {
    state = newState;
    updateStorage(state.get("route").toJS());
    updateHash(state.get("route").toJS());
    React.render(
      React.createElement(App, {
        state: state,
        dispatch: dispatch,
      }),
      global.document.body
    );
  });

  hash.on("change", function() {
    // When the url changes, we will change the current route to match what is
    // in the new url. If the route has not changed, then we'll normalize the
    // current url.
    var route = getRouteFromHash();
    var isSame = Immutable.is(state.get("route"), Immutable.fromJS(route));
    if ( ! isSame) {
      // Update current route
      dispatch("change-route", route);
    }
    else {
      // Normalize url
      updateHash(route);
    }
  });

  // Set initial route
  dispatch("change-route", getInitialRoute());
})();
