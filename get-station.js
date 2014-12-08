"use strict";

var find = require("array-find");
var stations = require("./stations.json");

function getStation(idOrFn) {
  return find(stations, function(station) {
    if (typeof idOrFn === "function") {
      return idOrFn.apply(this, arguments);
    }
    return idOrFn === station.id;
  });
}

module.exports = getStation;
