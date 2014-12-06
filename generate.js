"use strict";

var fs = require("fs");
var trumpet = require("trumpet");
var through = require("through2");
var scripts = require("./scripts");

function generate(scriptStream) {
  var tr = trumpet();
  fs.createReadStream(__dirname + "/template.html").pipe(tr);
  // Inject script
  scriptStream.pipe(tr.select("#script").createWriteStream());
  scriptStream.on("error", tr.emit.bind(tr, "error"));
  return tr;
}

module.exports = function() {
  return generate(scripts().bundle());
};

module.exports.watch = function() {
  function emit() {
    output.push(generate(script.bundle()));
  }

  var output = through.obj();
  var script = scripts.watch();
  script.on("update", emit);
  emit();
  return output;
};
