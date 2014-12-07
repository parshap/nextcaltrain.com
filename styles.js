"use strict";

var fs = require("fs");
var through = require("through2");
var rework = require('rework');
var reworknpm = require('rework-npm');
var myth = require("myth");
var CleanCSS = require("clean-css");

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
    var compiled = styles.toString({
      sourcemap: true,
    });
    if (process.env.NODE_ENV === "production") {
      compiled = new CleanCSS().minify(compiled);
    }
    output.push(compiled);
    output.push(null);
  });
  return output;
};
