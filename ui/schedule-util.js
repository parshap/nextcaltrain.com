"use strict";

function getFirstStop(scheduledTrip) {
  return scheduledTrip.tripStops[0];
}

function getLastStop(scheduledTrip) {
  return scheduledTrip.tripStops[scheduledTrip.tripStops.length - 1];
}


// ## Exports
//

module.exports.getFirstStop = getFirstStop;
module.exports.getLastStop = getLastStop;
