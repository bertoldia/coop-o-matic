var request = require("request");
var config = require("../config");
var router = require('express').Router();

function errorHandler(camCfg) {
  return function (err) {
    console.log("Error streaming camera feed at " + camCfg.feed.url + ":");
    console.log(err);
  };
}

/*
 * Forcibly terminate the stream. I'm not sure which combination of statements
 * does the trick.
 */
function closeStream(stream) {
  return function() {
    if (stream) {
      console.log("destroyed stream " + stream.feed.url);
      stream.end();
      stream.abort();
      stream.destroy();
      delete stream;
      stream = null;
    }
  };
}

function streamCamera(camCfg, errorCB) {
  return function (req, res) {
    // make a camera stream request and pipe it to the response object.
    var stream = request.get(camCfg.feed.url, camCfg);
    stream.on('error', errorCB);
    stream.pipe(res, {autoClose: true});
    // terminate the stream if the request is disconnected.
    req.on("close", closeStream(stream));
    req.on("end", closeStream(stream));
  };
}

function moveCamera(motion, camCfg) {
  return function(req, res) {
    request.get(motion, camCfg);
    res.end();
  };
}

for (var i in config.cameras) {
  var camCfg = config.cameras[i];
  router.get("/" + camCfg.feed.route, streamCamera(camCfg, errorHandler(camCfg)));
  for (var j in camCfg.motion) {
    var motion = camCfg.motion[j];
    router.get("/" + motion.route, moveCamera(motion.url, camCfg));
  }
}

module.exports = router;
