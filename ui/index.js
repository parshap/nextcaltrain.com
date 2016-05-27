"use strict";

var Immutable = require("immutable");
var React = require("react");
var App = require("./app");
var stations = require("nextcaltrain/stations");
var hash = require("hash-change");
var slug = require("to-slug-case");
var find = require("array-find");

///////////////////////
// GEOLOCATION
///////////////////////
var geo = require("./geolocation");
var store = require("nextcaltrain/index");
var stations = require("nextcaltrain/stations");

function getStationByStopId(stopId) {
  // return find(stations, function(station) {
  //   return stopId in station.stop_ids;
  // });
  return stations.byId(stopId);
}

function getStore() {
  return store;
}

///////////////////////
// END GEOLOCATION
///////////////////////


function getStationSlug(stationId) {
  return slug(stations.byId(stationId).name);
}

function updateHash(route, shouldReplace) {
  if (getCurrentHash() !== getHash(route)) {
    setHash(route, shouldReplace);
  }
}

function setHash(route, shouldReplace) {
  var hash = getHash(route);
  if (shouldReplace && window.replaceState) {
    window.replaceState(null, null, "#" + hash);
  }
  else {
    window.location.hash = hash;
  }
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
  var from = getStationBySlug(parts[0]);
  var to = getStationBySlug(parts[1]);
  return {
    from: from && from.id,
    to: to && to.id,
  };
}

function getStationBySlug(stationSlug) {
  return find(stations, function(station) {
    return slug(station.name) === stationSlug;
  });
}

function hasRoute(route) {
  return route && (route.from || route.to);
}

// ## Application state

var createState = require("./state");

module.exports = function(container) {
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
      container
    );
  });
  var initialRoute = getInitialRoute();

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
      updateHash(route, true);
    }
  });

  // Normalize initial url
  updateHash(initialRoute, true);

  // Set initial route
  dispatch("change-route", initialRoute);




  // select closest station based on GPS
  var
      selectStop = function (station) {
        var route = initialRoute;

        // automatically swap stations if they're on their return trip
        if (station.id == route.to) {
          route.to = route.from;
        }

        route.from = station.id;

        dispatch("change-route", route);
      },

      setIsLoading = function (isLoading) {
        // TODO
        if (isLoading) {
          
        }
        else {

        }
      };

  setIsLoading(true);
  geo.getClosestStop(getStore(), function (closestStop) {
    
    if (closestStop) {
      selectStop(getStationByStopId(closestStop.stop_id));
    }

    setIsLoading(false);
  });
};
