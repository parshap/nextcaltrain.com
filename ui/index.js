"use strict";

var Immutable = require("immutable");
var React = require("react");
var App = require("./app");
var stations = require("nextcaltrain/stations");
var hash = require("hash-change");
var slug = require("to-slug-case");
var find = require("array-find");


var store = require("nextcaltrain/index");

function getStore() {
  return store;
}

function getStationByStopId(stopId) {
  // return find(stations, function(station) {
  //   return stopId in station.stop_ids;
  // });
  return stations.byId(stopId);
}


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
  updateHash(getInitialRoute(), true);

  // Set initial route
  dispatch("change-route", getInitialRoute());




  // select closest station based on GPS
  if (navigator.geolocation) {

    var
      // haversine function from http://stackoverflow.com/a/27943/473201
      deg2rad = function (deg) {
        return deg * (Math.PI/180);
      },
      getDistanceFromLatLonInKm = function (lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1);
        var a =
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return d;
      },


      selectStop = function (stop) {
        var route = getInitialRoute(),
            station = getStationByStopId(stop.stop_id);

        // automatically swap stations if they're on their return trip
        if (station.id == route.to) {
          route.to = route.from;
        }

        route.from = station.id;
        //route.from = getStationBySlug(slug(stop.name));

        dispatch("change-route", route);
      },

      onLocation = function (position) {
        var latitude  = 37.757674;//position.coords.latitude;
        var longitude = -122.392636;//position.coords.longitude;

        // find station with shortest distance to current position
        var smallestDistance = Infinity,
            closestStop = null,
            store = getStore(),
            storeStops = store.store.stops,
            stops = [];

        for (var s in storeStops) {
          console.log(storeStops[s]);
          // wtf? why are there also stops with no code?
          //if (storeStops[s].stop_code) {
          if (storeStops[s].location_type == "1") {
            stops.push(storeStops[s]);
          }
        }

        // TODO: binary search this, since we know these stations are in order.
        stops.sort(function (stopA, stopB) {
          var distA = stopA._currentDistance || getDistanceFromLatLonInKm(
              latitude, 
              longitude, 
              parseFloat(stopA.stop_lat), 
              parseFloat(stopA.stop_lon)),

            distB = stopB._currentDistance || getDistanceFromLatLonInKm(
              latitude, 
              longitude, 
              parseFloat(stopB.stop_lat), 
              parseFloat(stopB.stop_lon));  

          // memoize!
          stopA._currentDistance = distA;            
          stopB._currentDistance = distB;

          return distA - distB;
        });
        
        selectStop(stops[0]);
      },
      onError = function (err) {
        console.error(err);
      };

    navigator.geolocation.getCurrentPosition(onLocation, onError);
  }
};
