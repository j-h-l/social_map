/*global $, WebSocket, google, overlay: true, D3HexbinGmapOverlay, GMAP */ //jslint keywords
/*jslint nomen: true */  // allow multiple vars
// Todo:
//  d3js hexbin overlay
//  adaptive panning/zooming

var WS = {
    host: "ws://localhost:9999/websocket",
    socket: {}
};
$(function () {
    'use strict';
    if (!(window.hasOwnProperty("WebSocket"))) {
        $('#session_status')
            .append("<p>Websocket not supported</p>");
    } else {
        var connect = function () {
            try {
                WS.socket = new WebSocket(WS.host);
                WS.socket.onopen = function () {
                    $('.ws-indicator').attr('src', "assets/greendot.png");
                };
                WS.socket.onmessage = function (msg) {
                    var p = JSON.parse(msg.data);
                    // var markerOpt = {
                    //     position: new google.maps.LatLng(p.lat, p.lng),
                    //     map: GMAP.map,
                    //     title: "new_checkin"
                    // };
                    // var addMarker = new google.maps.Marker(markerOpt);
                    var newPoint = new google.maps.LatLng(p.lat, p.lng);
                    var hexpoint = {lat: p.lat, lng: p.lng};

                    if (GMAP.d3overlay === null) {
                        var overlay = new D3HexbinGmapOverlay(GMAP.map, [hexpoint]);
                        GMAP.d3overlay = overlay;
                        // GMAP.d3overlay.setupDOM();
                    }
                    GMAP.map.panTo(newPoint);
                    GMAP.d3overlay.checkinData.push(hexpoint);
                    GMAP.d3overlay.setMap(GMAP.d3overlay.refmap);
                    
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
        connect();
    }

});
