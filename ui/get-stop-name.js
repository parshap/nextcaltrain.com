"use strict";

function getStopName(stop) {
// jshint camelcase:false
  return stop.stop_name
    .replace(" Caltrain Station", "");
}

module.exports = getStopName;
