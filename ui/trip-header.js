// jshint newcap:false, camelcase:false
"use strict";

var React = require("react");
var el = React.createElement;
var formatMinutes = require("../lib/time-utils").formatMinutes;
var colors = require("./colors");
var getFirstStop = require("./schedule-util").getFirstStop;
var getLastStop = require("./schedule-util").getLastStop;
var renderBoardTime = require("./board-time");
var getRouteName = require("nextcaltrain/route-name");

function renderTrainName(props) {
  var trainNumber = props.scheduledTrip.trip.trip_short_name;
  return el("span", {
    style: props.style,
    children: [
      props.scheduledTrip.direction,
      el("span", {
        style: {
          "margin-left": "0.25em",
        },
        children: trainNumber,
      }),
    ],
  });
}

function renderBoardTrainType(props) {
 return el("span", {
    style: props.styles,
    children: getRouteName(props.scheduledTrip.route.route_id),
  });
}

function getRouteBackgroundColor(route) {
  var routeName = getRouteName(route.route_id);
  if (routeName === "Limited") {
    return colors.limited;
  }
  else if (routeName === "Bullet") {
    return colors.bullet;
  }
  else {
    return colors.local;
  }
}

function renderBoardDuration(props) {
  var d = new Date(props.duration);
  return el("time", {
    className: props.className,
    style: props.style,
    children: [
      d.getUTCHours(),
      ":",
      formatMinutes(d.getUTCMinutes()),
    ],
  });
}

var ScheduledTripHeader = React.createClass({
  displayName: "ScheduledTripHeader",

  render: function() {
    var scheduledTrip = this.props.scheduledTrip;
    var firstStop = getFirstStop(scheduledTrip);
    var lastStop = getLastStop(scheduledTrip);
    return el("section", {
      style: this.props.style,
      children: [
        el(ScheduledTripTimes, {
          scheduledTrip: this.props.scheduledTrip,
        }),
        el("div", {
          className: [
            "board-font",
          ].join(" "),
          style: {
            "display": "table",
            "width": "100%",
          },
          children: [
            el(ScheduledTripTrainInfo, {
              style: {
                "display": "table-cell",
              },
              scheduledTrip: this.props.scheduledTrip,
            }),
            el("div", {
              style: {
                "display": "table-cell",
                "text-align": "right",
              },
              children: [
                el("span", {
                  className: "dim",
                  children: "Duration:",
                }),
                " ",
                renderBoardDuration({
                  duration: lastStop.date - firstStop.date
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
});

var ScheduledTripTimes = React.createClass({
  displayName: "ScheduledTripTimes",

  render: function() {
    var scheduledTrip = this.props.scheduledTrip;
    var firstStop = getFirstStop(scheduledTrip);
    var lastStop = getLastStop(scheduledTrip);
    return el("div", {
      className: [
        "board-font",
        "board-size",
      ].join(" "),
      style: {
        display: "table",
        "width": "100%",
      },
      children: [
        renderBoardTime({
          style: {
            display: "table-cell",
            "width": "50%",
          },
          date: firstStop.date,
        }),
        el("span", {
          style: {
            "padding": "0 0.5em",
            "text-align": "center",
            display: "table-cell",
          },
          children: "–",
        }),
        renderBoardTime({
          style: {
            display: "table-cell",
            "text-align": "right",
            "width": "50%",
          },
          date: lastStop.date,
        }),
      ],
    });
  },
});

var ScheduledTripTrainInfo = React.createClass({
  displayName: "ScheduledTripTrainInfo",

  render: function() {
    var scheduledTrip = this.props.scheduledTrip;
    return el("div", {
      style: {
        "background-color": getRouteBackgroundColor(scheduledTrip.route),
        "color": colors.foreground,
        "padding": "0.25em .35em",
        "display": "inline-block",
      },
      children: [
        renderTrainName({
          scheduledTrip: scheduledTrip,
        }),
        " ",
        renderBoardTrainType({
          scheduledTrip: scheduledTrip,
        }),
      ]
    });
  },
});

// ## Exports
//

module.exports = ScheduledTripHeader;
