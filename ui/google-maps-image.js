// # Google Maps Image of Caltrain Trip
//
// Return a URL to a static Google Maps Image showing a Caltrain trip.
//
// See https://developers.google.com/maps/documentation/staticmaps/intro
//

"use strict";

var API_URL = "https://maps.googleapis.com/maps/api/staticmap?";
var API_KEY = process.env.GOOGLE_MAPS_STATIC_API_KEY;

if ( ! API_KEY) {
  console.warn("Warning: GOOGLE_MAPS_STATIC_API_KEY environment variable should be set.");
}

var querystring = require("querystring");

function roundLocation(val) {
  return Math.round(val * 1000) / 1000;
}

function getStyles(styles) {
  return Object.keys(styles).map(function(name) {
    return name + ":" + styles[name];
  }).join("|");
}

function getLocation(latlong) {
  return roundLocation(latlong[0]) + "," + roundLocation(latlong[1]);
}

function getStopLocation(stop) {
  return [stop.stop.stop_lat, stop.stop.stop_lon];
}

function getStartMarker(firstStop) {
  var styles = getStyles({
    color: "0x00dd00",
    label: "A",
  });
  var location = getLocation(getStopLocation(firstStop));
  return styles + "|" + location;
}

function getEndMarker(lastStop) {
  var styles = getStyles({
    color: "0xdd0000",
    label: "B",
  });
  var location = getLocation(getStopLocation(lastStop));
  return styles + "|" + location;
}

function getIntermediateStopMarkers(intermediateStops) {
  var styles = getStyles({
    size: "small",
    color: "0xffaa00",
  });
  var locations = intermediateStops.map(function(stop) {
    return getLocation(getStopLocation(stop));
  });
  return styles + "|" + locations.join("|");
}

function getPath(stops) {
  var styles = getStyles({
    weight: 3,
  });
  var locations = stops.map(function(stop) {
    return getLocation(getStopLocation(stop));
  });
  return styles + "|" + locations.join("|");
}

function getMapStyle(feature, element, styles) {
  var result = [];
  if (feature) {
    result.push("feature:" + feature);
  }
  if (element) {
    result.push("element:" + element);
  }
  result.push(getStyles(styles));
  return result.join("|");
}

module.exports = function(trip, size) {
  var stops = trip.tripStops;
  var firstStop = stops[0];
  var lastStop = stops[stops.length - 1];
  return API_URL + querystring.stringify({
    size: size,
    scale: 2,
    style: [
      getMapStyle("landscape", null, {
        visibility: "simplified",
      }),
      getMapStyle("poi", null, {
        visibility: "off",
      }),
      getMapStyle("road", null, {
        visibility: "simplified",
      }),
    ],
    markers: [
      getStartMarker(firstStop),
      getEndMarker(lastStop),
      getIntermediateStopMarkers(stops.slice(1, stops.length - 1)),
    ],
    path: getPath(stops),
  });
};

