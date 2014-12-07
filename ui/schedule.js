// jshint newcap:false, camelcase:false
"use strict";

var xtend = require("xtend");
var React = require("react");
var el = React.createElement;
var getStopName = require("./get-stop-name");

function getFirstStop(scheduledTrip) {
  return scheduledTrip.tripStops[0];
}

function getLastStop(scheduledTrip) {
  return scheduledTrip.tripStops[scheduledTrip.tripStops.length - 1];
}

// ## Format Time
//

function formatTime(date) {
  return [
    formatHours(date.getHours()),
    ":",
    formatMinutes(date.getMinutes()),
    getAmPm(date),
    formatOptionalDate(date),
  ].join("");
}

function formatOptionalDate(date) {
  if ( ! isSameDay(date, new Date())) {
    return "*";
  }
}

function isSameDay(date1, date2) {
  return date1.getYear() === date2.getYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDay() === date2.getDay();
}

function getAmPm(date) {
  if (date.getHours() >= 12) {
    return "pm";
  }
  else {
    return "am";
  }
}

function formatHours(hours) {
  if (hours > 12) {
    hours -= 12;
  }
  if (hours === 0) {
    hours = 12;
  }
  return String(hours);
}

function formatMinutes(minutes) {
  return padTimePart(String(minutes));
}

function padTimePart(part) {
  if (part.length < 2) {
    return "0" + part;
  }
  return part;
}

// ## Format Duration

function formatDuration(ms) {
  var minutes = ms / 1000 / 60;
  if (minutes < 60) {
    return formatDurationMinutes(Math.round(minutes));
  }
  var hours = Math.floor(minutes / 60);
  minutes -= hours * 60;
  if (minutes === 0) {
    return formatDurationHours(hours);
  }
  return formatDurationHours(hours) + " " + formatDurationMinutes(minutes);
}

function formatDurationHours(hours) {
  return hours + " hr";
}

function formatDurationMinutes(minutes) {
  return minutes + " min";
}

// ## Scheduled Trip

function renderTime(props) {
  return el("time", xtend({
    style: xtend({
      "font-weight": "bolder",
    }, props),
  }, props));
}

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

function renderTrainType(props) {
  var trainType = props.scheduledTrip.route.route_long_name;
  return el("span", {
    style: props.style,
    children: trainType,
  });
}

function renderBoardTrainType(props) {
  var trainType = props.scheduledTrip.route.route_long_name;
  return el("span", {
    style: props.styles,
    children: trainType,
  });
}

function renderBoardTrainTypePadding(props) {
  var trainType = props.scheduledTrip.route.route_long_name;
  var padding = Array(8 - trainType.length).join("&nbsp;");
  return el("span", {
    dangerouslySetInnerHTML: {
      __html: padding,
    },
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

function renderNumStops(props) {
  return el("span", {
    children: [
      props.numStops,
      " stops",
    ],
  });
}

function formatTimeTitle(departDate, arriveDate, numStops) {
  return [
    "Depart: ",
    formatTime(departDate),
    "\nArrive: ",
    formatTime(arriveDate),
    "\nDuration: ",
    formatDuration(arriveDate - departDate),
    "\n",
    numStops - 1,
    " stops",
  ].join("");
}

var ScheduledTrip = React.createClass({
  getTripStopsCount: function() {
    return this.props.scheduledTrip.tripStops.length;
  },

  render: function() {
    var scheduledTrip = this.props.scheduledTrip;
    var numStops = scheduledTrip.tripStops.length;
    var firstStop = getFirstStop(scheduledTrip);
    var lastStop = getLastStop(scheduledTrip);
    return el("article", {
      style: xtend({
        "padding": "1.5rem 0",
        "border-top": "1px solid " + DIM_COLOR,
        "display": "table",
      }, this.props.style),
      children: [
        ScheduledTripHeader({
          scheduledTrip: scheduledTrip,
        }),
        /*
        ScheduledTripDetails({
          style: {
            "padding-left": "1rem",
            "font-size": "85%",
            "margin": "0.25rem 0",
          },
          scheduledTrip: this.props.scheduledTrip,
        }),
       */
      ],
    });
  },
});

function renderDateHeadingItem(props) {
  return el("div", {
    style: props.style,
    children: [
      el("span", {
        style: {
          "font-size": "80%",
          display: "block",
        },
        children: props.label
      }),
      el("time", {
        style: {
          "font-size": "200%",
          "line-height": "100%",
          display: "block",
        },
        dateTime: props.date.toISOString(),
        children: formatTime(props.date),
      }),
    ],
  });
}

function renderDuration(props) {
  return el("time", {
    style: props.style,
    children: formatDuration(props.duration),
  });
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

var DEFAULT_TRIP_COLOR = "f5f5f5";

function getTripColor(scheduledTrip) {
  return "#" + (scheduledTrip.route.route_color || DEFAULT_TRIP_COLOR);
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
  render: function() {
    var scheduledTrip = this.props.scheduledTrip;
    var trainType = this.props.scheduledTrip.route.route_long_name;
    var firstStop = getFirstStop(scheduledTrip);
    var lastStop = getLastStop(scheduledTrip);
    var numStops = scheduledTrip.tripStops.length;
    return el("header", {
      children: [
        ScheduledTripTimes({
          scheduledTrip: this.props.scheduledTrip,
        }),
        el("div", {
          className: [
            "board-font",
          ].join(" "),
          children: [
            ScheduledTripTrainInfo({
              scheduledTrip: this.props.scheduledTrip,
            }),
            " ",
            el("span", {
              className: "dim",
              children: "Duration:",
            }),
            " ",
            renderBoardDuration({
              duration: lastStop.date - firstStop.date
            }),
            /*
            ", ",
            (numStops - 1),
            " stops",
             */
          ],
        }),
      ],
    });
  },
});

var ScheduledTripTimes = React.createClass({
  render: function() {
    var scheduledTrip = this.props.scheduledTrip;
    var firstStop = getFirstStop(scheduledTrip);
    var lastStop = getLastStop(scheduledTrip);
    return el("div", {
      className: [
        "board-font",
        "board-size",
      ].join(" "),
      children: [
        renderBoardTime({
          date: firstStop.date,
        }),
        el("span", {
          style: {
            "margin": "0 0.5em",
          },
          children: "–",
        }),
        renderBoardTime({
          date: lastStop.date,
        }),
      ],
    });
  },
});

var ScheduledTripTrainInfo = React.createClass({
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

var ScheduledTripDetails = React.createClass({
  render: function() {
    return el("section", {
      style: this.props.style,
      children: this.renderStops(),
    });
  },

  renderStops: function() {
    var scheduledTrip = this.props.scheduledTrip;
    return scheduledTrip.tripStops.map(function(tripStop) {
      return TripStop({
        tripStop: tripStop
      });
    });
  },
});

function renderStationName(props) {
  return el("span", {
    children: getStopName(props.station),
  });
}

function formatTripStopTitle(tripStop) {
  return [
    "Arrive: ",
    formatTime(tripStop.date),
    "\nDeparrt: ",
    formatTime(tripStop.date),
    "\nStopped for: 3 min",
  ].join("");
}

var TripStop = React.createClass({
  render: function() {
    var tripStop = this.props.tripStop;
    return el("section", {
      children: [
        renderTime({
          dateTime: tripStop.date.toISOString(),
          children: formatTime(tripStop.date),
          title: formatTripStopTitle(tripStop),
        }),
        " ",
        renderStationName({
          station: tripStop.station,
        }),
      ],
    });
  },
});

// ## Exports - Schedule (List of scheduled stops)
//

module.exports = React.createClass({
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
