"use strict";

var React = require("react");
var el = React.createElement;
var caltrain = require("caltrain-schedule");

var CALTRAIN_RED = "#e22a2a";

var UI = React.createClass({
  getInitialState: function() {
    this.getNextStop = caltrain({
      from: "ctsf",
      to: "ctsmat",
      date: new Date(),
    });
    return {
      nextStop: this.getNextStop(),
    };
  },

  render: function() {
    return el("div", null, [
      el("h1", null, [
        "next",
        el("span", {
          style: {
            color: CALTRAIN_RED,
          },
          children: "caltrain.com",
        }),
      ]),
      el("div", null, [
      ]),
      el("pre", null, JSON.stringify(this.state.nextStop, null, 2)),
    ]);
  },
});

React.renderComponent(
  React.createElement(UI, {
  }),
  global.document.getElementById("container")
);
