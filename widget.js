/*global $*/

$(document).ready(function () {
    geolocate();

    if (screen.width > screen.height) { /* landscape */
        $("#symbol").css("height", "80%");
    } else {
        $("#symbol").css("width", "80%");
    }

    var $body = $("body"); // Cache this for performance

    var setBodyScale = function () {
        var scaleSource = $body.width(),
            scaleFactor = 0.60,
            maxScale = 800,
            minScale = 60; // Tweak these values to taste

        var fontSize = scaleSource * scaleFactor; // Multiply the width of the body by the scaling factor

        if (fontSize > maxScale) fontSize = maxScale;
        if (fontSize < minScale) fontSize = minScale; // Enforce the minimum and maximums

        $body.css("font-size", fontSize + "%");
    };

    $(window).resize(function () {
        setBodyScale();
    });

    setBodyScale();
});


function round(x) {
    return Math.round(x * 10000) / 10000.0;
}


function callWeatherService(pos) {
    var req = $.ajax({
        url: "/weather" + "?lat=" + round(pos.coords.latitude) + "&lon=" + round(pos.coords.longitude) + "&lang=" + navigator.language.substr(0, 2),
        dataType: "json",
        timeout: 3000
    });

    req.success(function (data) {
        var loctmp = $("#loctmp");
        loctmp.text(data["name"] + ", " + Math.round(data["main"]["temp"]));
        loctmp.append($("<span>&deg;C</span>"));
        var symb = $("#symbol");
        symb.attr("alt", data["weather"][0]["main"]);
        symb.attr("title", data["weather"][0]["main"]);
        symb.attr("src", "img/weather-" + data["weather"][0]["icon"] + ".svg");
    });

    req.fail(function () {
        var loctmp = $("#loctmp");
        loctmp.text("!! Weather Service Failure !!");
    });
}


function geolocate() {
    var url = $.url(document.location.href);
    if (typeof url.param("lat") !== "undefined" && typeof url.param("lon") !== "undefined") {
        var pos = {
            coords: {
                latitude: url.param("lat"),
                longitude: url.param("lon")
            }
        };
        callWeatherService(pos);
    } else if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            callWeatherService,
            function () {
                console.log("getCurrentPosition error = " + error);
                alert("Could not retrieve position. I'll show weather of Berlin instead...");
                callWeatherService({
                    coords: {
                        latitude: 52.518611,
                        longitude: 13.408056
                    }
                });
            }, {
                timeout: 5000
            });
    }
}