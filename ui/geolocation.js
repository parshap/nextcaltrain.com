/*
* @Author: tyler
* @Date:   2016-05-26 22:30:34
* @Last Modified by:   odbol
* @Last Modified time: 2016-05-26 22:53:09
*/

'use strict';


/**
 * Select closest stop based on GPS
 * 
 * @param  {Store}   store    the store with the stops data
 * @param  {Function(Stop)} callback called with closestStop, 
 *                                      or null if location unavailable.
 */
module.exports.getClosestStop = function (store, callback) {

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

      onLocation = function (position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;

        // find station with shortest distance to current position
        var
            storeStops = store.store.stops,
            stops = [];

        for (var s in storeStops) {
          // console.log(storeStops[s]);
          
          if (storeStops[s].location_type == "1") { // only get stations
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
        
        callback(stops[0]);
      },
      onError = function (err) {
        console.error(err);
      };

    navigator.geolocation.getCurrentPosition(onLocation, onError);
  }
}