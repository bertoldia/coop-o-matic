$(window).ready(function() {
  $.getJSON("/config", function(config) {
    addCameraSelectors(config);
    addSensorReadings(config);
  });
});

function addSensorReadings(config) {
  $(config.sensors).each(function() {
    $("<span/>", {
      "id": this.id,
      "class": "sensor-reading",
      "text": this.description
    }).appendTo("#sensors");
    var cb = sensorReadingCallback(this);
    readSensor(this, cb)();
    setInterval(readSensor(this, cb), this.reading.period * 1000);
  });
}

function readSensor(sensor, callback) {
  return function() {
    $.getJSON(sensor.reading.route, callback);
  };
}

function sensorReadingCallback(sensor) {
  return function(reading) {
    $('#' + sensor.id).text(sensor.description + ": " + reading.result);
  };
}

function addCameraSelectors(config) {
  $(config.cameras).each(function() {
    $("<span/>", {
      "id": this.id,
      "class": "camera-selector",
      "text": this.description
    }).click(selectCamera(this))
      .appendTo("#camera-selection");
  });
  selectCamera(config.cameras[0])();
}

function selectCamera(camera) {
  return function () {
    $("#videoframe img").attr("src", camera.feed.route);
    $(".camera-selector").removeClass("camera-selected");
    $("#" + camera.id).addClass("camera-selected");

    disconnectMotionCallbacks();
    connectMotionCallbacks(camera);

    removeExtra();
    addExtra(camera)
  };
}

function disconnectMotionCallbacks() {
  $(".cam-ctrl-button").off("mousedown mouseup");
}

function connectMotionCallbacks(camera) {
  if (!camera.motion) { return; }
  $("#cam-ctrl-button-up")
    .mousedown(function() { $.get(camera.motion.up.route); });
  $("#cam-ctrl-button-down")
    .mousedown(function() { $.get(camera.motion.down.route); });
  $("#cam-ctrl-button-left")
    .mousedown(function() { $.get(camera.motion.left.route); });
  $("#cam-ctrl-button-right")
    .mousedown(function() { $.get(camera.motion.right.route); });
  $(".cam-ctrl-button")
    .mouseup(function() { $.get(camera.motion.stop.route); });
}

function removeExtra() {
  $("#extra").empty();
}

function addExtra(camera) {
  if (!camera.extra) { return; }
  $(camera.extra).each(function() {
    $('<img src="' + this.img +
      '" title="' + this.caption + '"/>')
    .click(invokeExtra(this))
    .appendTo("#extra");
  });
}

function invokeExtra(extra) {
  return function() {
    $.get(extra.route);
  }
}
