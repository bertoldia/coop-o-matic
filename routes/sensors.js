var config = require("../config");
var exec = require('child_process').exec;
var router = require('express').Router();

// make json-rpc success reply.
function forSuccess(stdout) {
  console.log('stdout: ' + stdout);
  return {
    'jsonrpc': '2.0',
    'result': stdout.replace('\n', ''),
    'id': 666
  };
}

// make json-rpc error reply.
function forError(stderr, error) {
  console.log('stderr: ' + stderr);
  console.log('error: ' + error);
  var code = error == null ? null : error.code;
  return {
    'jsonrpc': '2.0',
    'error': stderr.replace('\n', ''),
    'code': code,
    'id': 666
  };
}

function execCmd(sensor) {
  return function (req, res) {
    var child = exec(sensor.cmd, function (error, stdout, stderr) {
      if (stdout) { res.json(forSuccess(stdout)); }
      else if (stderr) { res.json(forError(stderr, error)); }
    });
  };
}

for (var i in config.sensors) {
  var sensor = config.sensors[i];
  router.get("/" + sensor.reading.route,
             execCmd(sensor.reading));
}

module.exports = router;
