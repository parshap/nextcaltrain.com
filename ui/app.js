"use strict";

var React = require("react");
var el = React.createElement;
var xtend = require("xtend");
var RouteSelector = require("./route-selector");
var Schedule = require("./schedule");
var Trip = require("./trip");
var TwoColumn = require("./two-column");
var Responsive = require("./responsive");
var TwitterIcon = require("./icons/twitter");
var GitHubIcon = require("./icons/github");
var EnvelopeIcon = require("./icons/envelope");
var leftPad = require("left-pad");
var fs = require("fs");

var PANE_SIZE = 320;
var MARGIN_SIZE = 24;
var MIN_BIG_SIZE = PANE_SIZE * 2 + MARGIN_SIZE;
var LAST_UPDATED_DATE = new Date(
  fs.readFileSync(__dirname + "/../LAST_UPDATED", "utf8")
    .replace(/\s+$/, "")
);

function getLocaleDateString(date) {
  if (date.toLocaleDateString) {
    return date.toLocaleDateString()
  }
  else {
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
  }
}

module.exports = React.createClass({
  handleTripSelect: function(trip) {
    this.props.dispatch("select-trip", trip);
  },

  handleTripUnselect: function() {
    this.props.dispatch("select-trip", null);
  },

  render: function() {
    return el(Responsive.Window, {
      renderChildren: function(state) {
        if (state.width >= MIN_BIG_SIZE) {
          return this.renderTwoColumn();
        }
        else {
          return this.renderOneColumn();
        }
      }.bind(this),
    });
  },

  renderTwoColumn: function() {
    return el(TwoColumn, {
      style: {
        "height": "100%",
        "width": "100%",
        "max-width": MIN_BIG_SIZE + "px",
        "margin": "0 auto",
      },
      leftStyle: {
        "width": PANE_SIZE,
      },
      leftChildren: this.renderScheduleSection(),
      rightChildren: this.renderSelectedTrip(),
    });
  },

  renderOneColumn: function() {
    return el("div", {
     style: {
       width: PANE_SIZE,
       margin: "0 auto",
     },
     children: this.renderScheduleSection({
       shouldExpand: true,
     }),
    });
  },

  renderScheduleSection: function(props) {
    return el("div", {
      style: {
        margin: "1.5rem 0 0 0",
      },
      children: [
        el(RouteSelector, {
          style: {
            margin: "0 1rem 1rem 1rem",
          },
          route: this.props.state.get("route").toJS(),
          onChange: this.props.dispatch.bind(null, "change-route"),
        }),
        this.renderSchedule(props),
        this.renderFooter(),
      ],
    })
  },

  renderSchedule: function(props) {
    var schedule = this.props.state.get("schedule");
    if (schedule) {
      return el(Schedule, xtend({
        schedule: schedule,
        selectedTrip: this.props.state.get("selectedTrip"),
        onTripSelect: this.handleTripSelect,
        onTripUnselect: this.handleTripUnselect,
      }, props));
    }
  },

  renderFooter: function() {
    var updatedDate = getLocaleDateString(LAST_UPDATED_DATE);
    return el("div", {
      style: {
        "text-align": "right",
        "font-size": "85%",
        "opacity": "0.4",
        "margin": "0.5rem 0",
      },
      children: [
        el("a", {
          href: "https://github.com/parshap/nextcaltrain.com",
          title: "nextacltrain.com on GitHub",
          style: {
            color: "inherit",
            "text-decoration": "none",
          },
          children: GitHubIcon({
            style: {
              height: "1.1em",
              "margin-bottom": "0.15em",
              "vertical-align": "middle",
            },
          })
        }),
        el("a", {
          title: "parshap on Twitter",
          href: "https://twitter.com/parshap",
          style: {
            color: "inherit",
            "text-decoration": "none",
            "margin-left": "0.5em",
          },
          children: TwitterIcon({
            style: {
              height: "1.1em",
              "margin-bottom": "0.15em",
              "vertical-align": "middle",
            },
          })
        }),
        el("a", {
          title: "email parshap@gmail.com",
          href: "mailto:parshap+nextcaltrain@gmail.com",
          style: {
            color: "inherit",
            "text-decoration": "none",
            "margin-left": "0.5em",
          },
          children: EnvelopeIcon({
            style: {
              height: "1em",
              "margin-bottom": "0.15em",
              "vertical-align": "middle",
            },
          })
        }),
        el("time", {
          style: {
            "margin-left": "0.5em",
            "border-bottom": "1px dashed",
            "cursor": "help",
          },
          itemprop: "dateModified",
          datetime: LAST_UPDATED_DATE.toISOString(),
          title: "Last updated",
          children: updatedDate,
        }),
      ],
    });
  },

  renderSelectedTrip: function() {
    var trip = this.props.state.get("selectedTrip");
    if (trip) {
      return el(Trip, {
        trip: trip,
        style: {
          margin: "1.5rem 0 1.5rem 1.5rem",
        },
      });
    }
  },
});
