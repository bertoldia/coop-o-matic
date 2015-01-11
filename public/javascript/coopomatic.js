$(window).ready(function() {
  $.getJSON("/config", function(config) {
    addCameraSelectors(config);
  });
});

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
