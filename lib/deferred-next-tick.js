"use strict";

function defer(callback) {
  process.nextTick(callback);
}

module.exports = function(callback) {
  var waiting = false;
  return function() {
    if ( ! waiting) {
      waiting = true;
      defer(function() {
        waiting = false;
        callback();
      });
    }
  };
};
