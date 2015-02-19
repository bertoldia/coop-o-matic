var config = require("../config");
var router = require('express').Router();

var copy = JSON.parse(JSON.stringify(config));

for (var i in copy.cameras) {
 delete copy.cameras[i].auth;
 delete copy.cameras[i].feed.url;
 for (var m in copy.cameras[i].motion) {
   delete copy.cameras[i].motion[m].url;
 }
 for (var e in copy.cameras[i].extra) {
   delete copy.cameras[i].extra[e].url;
 }
}

for (var i in copy.sensors) {
 delete copy.sensors[i].reading.cmd;
 delete copy.sensors[i].reading.args;
}

router.get("/config", function(req, res) {
  res.json(copy);
});

module.exports = router;
