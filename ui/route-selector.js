"use strict";

var React = require("react");
var el = React.createElement;
var caltrain = require("caltrain-schedule");
var stations = require("../stations.json");
var getStopName = require("./get-stop-name");

module.exports = React.createClass({
  render: function() {
    return el("div", {
      children: this.renderStations(),
    });
  },

  renderStations: function() {
    return stations.map(function(station) {
      var name = getStopName(caltrain.store.stops[station.id]);
      return el("div", {
        children: [
          el("input", {
            name: "from",
            type: "radio",
            onChange: this.handleChange.bind(this, "from", station.id),
            checked: station.id === this.props.route.from,
          }),
          " ",
          el("input", {
            name: "to",
            type: "radio",
            onChange: this.handleChange.bind(this, "to", station.id),
            checked: station.id === this.props.route.to,
          }),
          " ",
          el("label", null, name),
        ],
      });
    }.bind(this));
  },

  handleChange: function(type, stopId) {
    var state = {};
    state[type] = stopId;
    this.props.onChange(state);
  },
});
