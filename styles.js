"use strict";

var fs = require("fs");
var through = require("through2");
var rework = require('rework');
var reworknpm = require('rework-npm');
var myth = require("myth");

module.exports = function() {
  var output = through();
  fs.readFile("./styles.css", "utf8", function(err, source) {
    if (err) {
      return output.emit("error", err);
    }
    var styles = rework(source, { source: 'styles.css' });
    styles.use(reworknpm({
      root: __dirname,
    }));
    styles.use(myth());
    output.push(styles.toString({
      sourcemap: true,
    }));
    output.push(null);
  });
  return output;
};
