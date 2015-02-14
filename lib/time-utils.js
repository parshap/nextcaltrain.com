"use strict";

// ## Day of week names
//

var SHORT_DAY_NAMES = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

// ## Short Month Names
//

var SHORT_MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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

// ## Exports
//

module.exports.formatTime = formatTime;
module.exports.getAmPm = getAmPm;
module.exports.formatHours = formatHours;
module.exports.formatMinutes = formatMinutes;
module.exports.SHORT_DAY_NAMES = SHORT_DAY_NAMES;
module.exports.SHORT_MONTH_NAMES = SHORT_MONTH_NAMES;
