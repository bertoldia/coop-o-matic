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
    }).click(selectCamera(this.feed.route))
      .appendTo("#camera-selection");
  });
}

function selectCamera(cameraRoute) {
  return function () {
    $("#videoframe img").attr("src", cameraRoute);
  };
}
