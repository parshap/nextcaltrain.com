"use strict";

var test = require("tape");
var generate = require("./generate.js");
var styleguide = require("./styleguide.js");

test("generate", function(t) {
  generate()
    .on("error", t.ifError)
    .on("end", t.end);
});

test("styleguide", function(t) {
  styleguide()
    .on("error", t.ifError)
    .on("end", t.end);
});
