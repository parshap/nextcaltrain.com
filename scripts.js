"use strict";

var browserify = require("browserify");
var watchify = require("watchify");
var envify = require("envify/custom");
var uglifyify = require("uglifyify");
var xtend = require("xtend");

function scripts(opts) {
  var env = opts.env || process.env;
  var b = browserify(__dirname + "/ui/bootstrap", opts);
  b.transform(envify(env));
  if (env.NODE_ENV === "production") {
    b.transform({ global: true }, uglifyify);
  }
  return b;
}

function watch(opts) {
  opts = xtend(opts, watchify.args);
  return watchify(scripts(opts));
}

module.exports = scripts;
module.exports.watch = watch;
