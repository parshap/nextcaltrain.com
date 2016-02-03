"use strict";

var React = require("react");
var fs = require("fs");
var trumpet = require("trumpet");
var styles = require("./styles");
var uiState = require("./ui/state");
var App = require("./ui/app");

function generate() {
  var tr = trumpet();
  fs.createReadStream(__dirname + "/styleguide.html").pipe(tr);
  // Inject css
  styles().pipe(tr.select("style").createWriteStream());
  var containerElStream = tr.select("#container").createWriteStream();
  containerElStream.write(renderMarkup());
  containerElStream.end();
  return tr;
}

function renderMarkup() {
  var state = uiState.getInitialState();
  state = uiState.applyAction(state, "change-route", {
    from: "ctsf",
    to: "ctsj",
    date: new Date(2016, 0, 1),
  });
  return React.renderToStaticMarkup(
    React.createElement(App, {
      state: state,
      dispatch: function(){},
    })
  );
}

// Watch styleguide.html using node-dev
if (process.send) {
  process.send({cmd: 'NODE_DEV', required: __dirname + "/styleguide.html"});
}

module.exports = generate;
