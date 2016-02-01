"use strict";

var xtend = require("xtend");
var React = require("react");
var el = React.createElement;
var stations = require("nextcaltrain/stations");
var colors = require("./colors");

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
      return colors.selected;
    }
    else {
      return colors.background;
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

  getClassName: function() {
    return [
      "board-font",
      this.state.focused && "is-focused",
    ].join(" ");
  },

  getOptions: function() {
    if ( ! this.props.value) {
      return [
        el("option", {
          value: "",
          children: "",
        }),
      ].concat(this.props.children);
    }
    else {
      return this.props.children;
    }
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
      children: this.getOptions(),
      onChange: this.props.onChange,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      value: this.props.value || "",
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
            "background-color": colors.background,
            "color": "#111",
            "padding": "0 0.25em",
            "border-bottom": "0.25rem solid " + colors.shadow,
            "white-space": "nowrap",
          },
          className: this.getClassName(),
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
    var station = stations.byId(this.props.route.from);
    if (station) {
      return station.name;
    }
  },

  getToName: function() {
    var station = stations.byId(this.props.route.to);
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
            "margin-bottom": ".8rem",
          },
          text: this.getFromName(),
          value: this.props.route.from,
          children: this.renderOptions(),
          onChange: this.handleChange.bind(this, "from"),
        }),
        el(Dropdown, {
          id: "to",
          label: "To",
          text: this.getToName(),
          value: this.props.route.to,
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
