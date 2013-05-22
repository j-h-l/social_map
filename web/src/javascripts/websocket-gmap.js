/*global $, WebSocket, google, d3 */ //jslint keywords
/*jslint nomen: true */
// todo: 
//       calculate coordinate translation between gmap and d3js
//       process checkin streams on to bins (replace markers)

$(document).ready(function () {
    'use strict';
    if (!(window.hasOwnProperty("WebSocket"))) {
        $('#session_status').append("<p>Sorry websocket is not supported in your browser. Try something else.</p>");
    } else {
        var map,
            host = "ws://localhost:9999/websocket",
            checkindata = [],
            d3test = d3.select("#map-canvas").append("d3-svg"),
            d3overlay,

            initializeMap = function () {
                var mapOptions = {
                        zoom: 12,
                        center: new google.maps.LatLng(37.7843, -122.3992),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                map = new google.maps.Map($('#map-canvas')[0], mapOptions);

                // Bounds for overlay // todo: need to automate
                var swBound = new google.maps.LatLng(37.7831, -122.4114);
                var neBound = new google.maps.LatLng(37.7896, -122.4042);
                var bounds = new google.maps.LatLngBounds(swBound, neBound);

                var overlayImage = "assets/testpin.png";
                d3overlay = new D3Overlay(bounds, overlayImage, map);
            },

            // WebSocket connection //
            // -------------------- //
            connect = function () {
                var socket = new WebSocket(host);

                try {
                    socket.onopen = function () {
                        // $('#session_status').append("<p>Websocket is now open through: " + host + "</p>");
                        $('.ws-indicator').attr('src', "assets/greendot.png");
                    };

                    socket.onmessage = function (msg) {
                        var j = JSON.parse(msg.data),
                            markoptions = {
                                position: new google.maps.LatLng(j.lat, j.lng),
                                map: map,
                                title: "newone"
                            },
                            addM = new google.maps.Marker(markoptions);

                        checkindata.push({lat: j.lat, lng: j.lng});
                        d3test.selectAll("circle")
                              .data(checkindata)
                              .enter()
                              .append("circle")
                              .attr("cx", function(d) { return d.lat })
                              .attr("cy", function(d) { return d.lng })
                              .attr("r", function() { return 3 });

                        map.panTo(addM.getPosition());
                    };

                    socket.onclose = function () {
                        // $('#session_status').append("<p>Websocket is now closed. Thank you come again.</p>");
                        $('.ws-indicator').attr('src', "assets/reddot.png");
                        // d3.select("#ws-control").transition().delay(1250)
                            // .style("background-color", "black");

                    };

                    $('#disconnect').click(function () {
                        socket.close();
                    });

                } catch (error) {
                    console.log("Websocket error:" + error);
                }
            };

        // d3js overlay //
        // ------------ //
        // not yet with d3js overlay - just plain image overlay
        // testing overlay layer
        var D3Overlay = function (bounds, overlayImage, map) {
            // Initialize properties
            this.bounds_ = bounds;
            this.overlayImage_ = overlayImage;
            this.map_ = map;

            this.div_ = null;

            // set map here
            this.setMap(map);
        };
        D3Overlay.prototype = new google.maps.OverlayView();

        D3Overlay.prototype.onAdd = function () {
            var div = document.createElement('div');
            div.style.border = "none";
            div.style.borderWidth = "0px";
            div.style.position = "absolute";
            $(div).addClass("d3-overlay");

            // attach img to div
            var img = document.createElement('img');
            img.src = this.overlayImage_;
            img.style.width = "100%";
            img.style.height = "100%";
            div.appendChild(img);

            // set the overlay's div_ to this div
            this.div_ = div;

            var panes = this.getPanes();
            panes.overlayLayer.appendChild(div);

        };
        D3Overlay.prototype.draw = function () {
            var overlayProjection = this.getProjection();
            var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
            var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

            var div = this.div_;
            div.style.left = sw.x + 'px';
            div.style.top = ne.y + 'px';
            div.style.width = (ne.x - sw.x) + 'px';
            div.style.height = (sw.y - ne.y) + 'px';
        };

        // Run these //
        // --------- //
        google.maps.event.addDomListener(window, 'load', initializeMap);
        connect();
    }
});
