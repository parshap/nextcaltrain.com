"use strict";

var find = require("array-find");
var xtend = require("xtend");
var React = require("react");
var el = React.createElement;
var stations = require("../stations.json");

function getStation(id) {
  return find(stations, function(station) {
    return id === station.id;
  });
}

// ## Dropdown
//

var SELECT_STYLE = {
  "position": "absolute",
  "width": "100%",
  "opacity": 0,
  top: 0,
  left: 0,
};

var Dropdown = React.createClass({
  getBackgroundColor: function() {
    if (this.state.focused) {
      return "#c4c4c4";
    }
    else {
      return "#f5f5f5";
    }
  },

  handleFocus: function() {
    this.setState({
      focused: true,
    });
  },

  handleBlur: function() {
    this.setState({
      focused: false,
    });
  },

  getInitialState: function() {
    return {
      focused: false,
    };
  },

  render: function() {
    return el("div", {
      style: xtend({
        "position": "relative",
      }, this.props.style),
      children: [
        this.renderBody(),
        this.renderSelect(),
      ],
    });
  },

  renderSelect: function() {
    return el("select", {
      id: this.props.id,
      style: SELECT_STYLE,
      children: this.props.children,
      onChange: this.props.onChange,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      value: this.props.value,
    });
  },

  renderBody: function() {
    return el("label", {
      htmlFor: this.props.id,
      children: [
        this.renderLabel(),
        el("span", {
          "aria-hidden": true,
          style: {
            "margin-left": ".25em",
            "background-color": this.getBackgroundColor(),
            "color": "#111",
            "padding": "0 0.2em",
          },
          className: "board-font",
          children: [
            this.props.text,
            el("span", {
              style: {
                "margin-left": ".5em",
                "font-size": "60%",
                "vertical-align": "middle",
              },
              children: "▼",
            }),
          ],
        }),
      ],
    });
  },

  renderLabel: function() {
    return el("span", {
      style: {
        "font-size": "85%",
        "min-width": "3em",
        display: "inline-block",
      },
      className: "dim",
      children: this.props.label + ": ",
    });
  },
});

module.exports = React.createClass({
  getFromName: function() {
    var station = getStation(this.props.from);
    if (station) {
      return station.name;
    }
  },

  getToName: function() {
    var station = getStation(this.props.to);
    if (station) {
      return station.name;
    }
  },

  render: function() {
    return el("section", {
      style: xtend({
        "font-size": "140%",
        "line-height": "120%",
      }, this.props.style),
      children: [
        el(Dropdown, {
          id: "from",
          label: "From",
          style: {
            "margin-bottom": ".5rem",
          },
          text: this.getFromName(),
          value: this.props.from,
          children: this.renderOptions(),
          onChange: this.handleChange.bind(this, "from"),
        }),
        el(Dropdown, {
          id: "to",
          label: "To",
          text: this.getToName(),
          value: this.props.to,
          children: this.renderOptions(),
          onChange: this.handleChange.bind(this, "to"),
        }),
      ],
    });
  },

  renderOptions: function() {
    return stations.map(function(station) {
      return el("option", {
        value: station.id,
        children: station.name,
      });
    });
  },

  handleChange: function(type, e) {
    var stopId = e.target.value;
    var state = {};
    state[type] = stopId;
    this.props.onChange(state);
  },
});
