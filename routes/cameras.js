var request = require("request");
var config = require("../config");
var router = require('express').Router();

function errorHandler(camCfg) {
  return function (err) {
    console.log("Error streaming camera feed at " + camCfg.feed.url + ":");
    console.log(err);
  };
}

function streamCamera(camCfg, errorCB) {
  return function (req, rep) {
      request.get(camCfg.feed.url, camCfg).on('error', errorCB).pipe(rep);
  };
}

for (var i in config.cameras) {
  var camCfg = config.cameras[i];
  router.get("/" + camCfg.feed.route, streamCamera(camCfg, errorHandler(camCfg)));
}

module.exports = router;
