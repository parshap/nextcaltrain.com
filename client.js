"use strict";
Bugsnag.releaseStage = process.env.NODE_ENV || "development";
require("./ui")(global.document.getElementById("container"));
