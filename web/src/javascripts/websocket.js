/*global $, WebSocket, google */ //jslint keywords
/*jslint nomen: true */  // allow multiple vars

var WS = {
    host: "ws://localhost:9999/websocket",
    socket: {},
    parsedData: {}
};
$(function () {
    'use strict';
    if (!(window.hasOwnProperty("WebSocket"))) {
        $('#session_status')
            .append("<p>Websocket not supported</p>");
    } else {
        var connect = function () {
            WS.socket = new WebSocket(WS.host);

            try {
                WS.socket.onopen = function () {
                    $('.ws-indicator').attr('src', "assets/greendot.png");
                };
                WS.socket.onmessage = function (msg) {
                    var p = JSON.parse(msg.data);
                    var markerOpt = {
                        position: new google.maps.LatLng(p.lat, p.lng),
                        map: GMAP.map,
                        title: "new_checkin"
                    };
                    var addMarker = new google.maps.Marker(markerOpt);
                    GMAP.map.panTo(addMarker.getPosition());
                    console.log("Received data: " + p.lat + ", " + p.lng);
                    
                };
                WS.socket.onclose = function () {
                    $('.ws-indicator').attr('src', "assets/reddot.png");
                };

                $('#disconnect').click(function () {
                    WS.socket.close();
                });
            } catch (error) {
                console.log("Websocket error: " + error);
            }
        };
        google.maps.event.addDomListener(window, 'load', g_initialize);
        connect();
    }

});
