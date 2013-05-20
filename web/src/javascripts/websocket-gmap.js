/*global $, WebSocket, google */ //jslint keywords
// todo: transition to green/red light for websocket status
//       calculate coordinate translation between gmap and d3js
//       process checkin streams on to bins (replace markers)

$(document).ready(function () {
    'use strict';
    // $('.ws-indicator')
    //     .mouseover(function () {
    //         var dot = $('.ws-indicator');
    //         dot.attr('src', "assets/greendot.png");
    //     })
    //     .mouseout(function () {
    //         var dot = $('.ws-indicator');
    //         dot.attr('src', "assets/reddot.png");
    //     });
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
                        // $('#session_status').append("<p>Websocket is now open through: " + host + "</p>");
                        $('.ws-indicator').attr('src', "assets/greendot.png");
                        // var dot = $('.ws-indicator').attr('src');
                        // dot.attr('src', "greendot.png");

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
                        // $('#session_status').append("<p>Websocket is now closed. Thank you come again.</p>");
                        $('.ws-indicator').attr('src', "assets/reddot.png");
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
