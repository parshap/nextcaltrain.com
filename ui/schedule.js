// jshint newcap:false, camelcase:false
"use strict";

var xtend = require("xtend");
var React = require("react");
var el = React.createElement;
var getStopName = require("./get-stop-name");
var formatHours = require("../lib/time-utils").formatHours;
var formatMinutes = require("../lib/time-utils").formatMinutes;
var getAmPm = require("../lib/time-utils").getAmPm;

function getFirstStop(scheduledTrip) {
  return scheduledTrip.tripStops[0];
}

function getLastStop(scheduledTrip) {
  return scheduledTrip.tripStops[scheduledTrip.tripStops.length - 1];
}

// ## Scheduled Trip

function renderTrainName(props) {
  var firstTripStop = getFirstStop(props.scheduledTrip);
  var headsign = firstTripStop.stop.platform_code;
  var trainNumber = props.scheduledTrip.trip.trip_short_name;
  return el("span", {
    style: props.style,
    children: [
      headsign,
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
  var trainType = props.scheduledTrip.route.route_long_name;
  return el("span", {
    style: props.styles,
    children: trainType,
  });
}

var DIM_COLOR = "#c4c4c4";

var LIMITED_COLOR = "#fef0b5";
var BULLET_COLOR = "#e31837";
var LOCAL_COLOR = DIM_COLOR;

function getTrainTypeBackgroundColor(type) {
  if (type === "Limited") {
    return LIMITED_COLOR;
  }
  else if (type === "Bullet") {
    return BULLET_COLOR;
  }
  else {
    return LOCAL_COLOR;
  }
}

function getTrainTypeColor(type) {
  if (type === "Limited") {
    return "#111";
  }
  else if (type === "Bullet") {
    return "#f5f5f5";
  }
  else {
    return "#111";
  }
}

var ScheduledTrip = React.createClass({
  displayName: "ScheduledTrip",

  getTripStopsCount: function() {
    return this.props.scheduledTrip.tripStops.length;
  },

  render: function() {
    var scheduledTrip = this.props.scheduledTrip;
    return el("article", {
      style: xtend({
        "padding": "1.5rem 1rem",
        "border-top": "1px solid " + DIM_COLOR,
      }, this.props.style),
      children: [
        ScheduledTripHeader({
          scheduledTrip: scheduledTrip,
        }),
      ],
    });
  },
});

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

function renderBoardTime(props) {
  var date = props.date;
  return el("time", {
    style: props.style,
    dateTime: date.toISOString(),
    children: [
      renderBoardHours(date.getHours()),
      ":",
      formatMinutes(date.getMinutes()),
      el("span", {
        className: "dim",
        style: {
          "margin-left": ".4em",
          "font-size": "65%",
          "text-transform": "uppercase",
        },
        children: getAmPm(date),
      }),
    ],
  });
}

function renderBoardHours(hours) {
  hours = formatHours(hours);
  if (hours.length < 2) {
    return el("span", {
      dangerouslySetInnerHTML: {
        __html: "0" + hours,
      },
    });
  }
  else {
    return hours;
  }
}

var ScheduledTripHeader = React.createClass({
  displayName: "ScheduledTripHeader",

  render: function() {
    var scheduledTrip = this.props.scheduledTrip;
    var firstStop = getFirstStop(scheduledTrip);
    var lastStop = getLastStop(scheduledTrip);
    return el("header", {
      children: [
        ScheduledTripTimes({
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
            ScheduledTripTrainInfo({
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
            "margin": "0 0.5em",
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
    var trainType = this.props.scheduledTrip.route.route_long_name;
    return el("div", {
      style: {
        "background-color": getTrainTypeBackgroundColor(trainType),
        "color": getTrainTypeColor(trainType),
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

// ## Exports - Schedule (List of scheduled stops)
//

module.exports = React.createClass({
  displayName: "Schedule",

  getDepartingStationName: function() {
    return getStopName(getFirstStop(this.props.schedule[0]).station);
  },

  getArrivingStationName: function() {
    return getStopName(getLastStop(this.props.schedule[0]).station);
  },

  render: function() {
    return el("article", {
      children: [
        this.renderSchedule(),
      ],
    });
  },

  renderSchedule: function() {
    return this.props.schedule.map(function(scheduledTrip) {
      return ScheduledTrip({
        scheduledTrip: scheduledTrip,
      });
    });
  },
});
