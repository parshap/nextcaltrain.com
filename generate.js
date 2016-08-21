"use strict";

var VERSION = require("./package.json").version;
var BUGSNAG_API_KEY = "8e2bf8545defa9c898769b2afa4685da";
var BUGSNAG_RELEASE_STAGE = process.env.NODE_ENV || "development";

var fs = require("fs");
var trumpet = require("trumpet");
var through = require("through2");
var chokidar = require("chokidar");
var scripts = require("./scripts");
var styles = require("./styles");

function injectBugsnag(tr) {
  var bugsnagScriptEl = tr.select("script#bugsnag");
  bugsnagScriptEl.setAttribute("data-apikey", BUGSNAG_API_KEY);
  bugsnagScriptEl.setAttribute("data-releasestage", BUGSNAG_RELEASE_STAGE);
  bugsnagScriptEl.setAttribute("data-appversion", VERSION);
  fs.createReadStream(__dirname + "/vendor/bugsnag-3.min.js")
    .pipe(bugsnagScriptEl.createWriteStream());
}

function generate(scriptStream) {
  var tr = trumpet();
  fs.createReadStream(__dirname + "/template.html").pipe(tr);
  // Inject css
  styles().pipe(tr.select("style").createWriteStream());
  // Inject Bugsnag
  injectBugsnag(tr)
  // Inject main script
  scriptStream.pipe(tr.select("script#main").createWriteStream());
  scriptStream.on("error", tr.emit.bind(tr, "error"));
  return tr;
}

function watchSource(fn) {
  chokidar.watch([
    __dirname + "/template.html",
    __dirname + "/vendor/bugsnag-3.min.js",
    __dirname + "/styles.css",
  ]).on("change", fn);
}

module.exports = function() {
  return generate(scripts().bundle());
};

module.exports.watch = function() {
  function emit() {
    console.time("scripts");
    var scripts = script.bundle();
    scripts.on("end", console.timeEnd.bind(console, "scripts"));
    output.push(generate(scripts));
  }

  var output = through.obj();
  var script = scripts.watch();
  script.on("update", emit);
  watchSource(emit);
  emit();
  return output;
};
