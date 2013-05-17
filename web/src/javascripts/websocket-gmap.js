/*global $, WebSocket, google */ //jslint keywords

$(document).ready(function () {
    'use strict';
    if (!(window.hasOwnProperty("WebSocket"))) {
        $('#session_status').append("<p>Sorry websocket is not supported in your browser. Try something else.</p>");
    } else {
        var map,
            host = "ws://localhost:9999/websocket",

            initializeMap = function () {
                var mapOptions = {
                        zoom: 4,
                        center: new google.maps.LatLng(-34.397, 150.644),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                map = new google.maps.Map($('#map-canvas')[0], mapOptions);
            },

            connect = function () {
                var socket = new WebSocket(host);

                try {
                    socket.onopen = function () {
                        $('#session_status').append("<p>Websocket is now open through: " + host + "</p>");
                    };

                    socket.onmessage = function (msg) {
                        var j = JSON.parse(msg.data),
                            markoptions = {
                                position: new google.maps.LatLng(j.lat, j.lng),
                                map: map,
                                title: "newone"
                            },
                            addM = new google.maps.Marker(markoptions);

                        map.panTo(addM.getPosition());
                    };

                    socket.onclose = function () {
                        $('#session_status').append("<p>Websocket is now closed. Thank you come again.</p>");
                    };

                    $('#disconnect').click(function () {
                        socket.close();
                    });

                } catch (error) {
                    console.log("Websocket error:" + error);
                }
            };

        google.maps.event.addDomListener(window, 'load', initializeMap);
        connect();
    }
});
