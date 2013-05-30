/*global $, google, d3 */
/*jslint nomen: true */
var GMAP = {
    map: null,
    d3overlay: null,
    initialOptions: {
        zoom: 12,
        center: new google.maps.LatLng(37.7843, -122.3992),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
};

$(function () {
    'use strict';
    var g_initialize = function () {
        GMAP.map = new google.maps.Map($('#map-canvas')[0], GMAP.initialOptions);
    };

    google.maps.event.addDomListener(window, 'load', g_initialize);

    var sampler = function () {
        if (GMAP.d3overlay === null) {
        var overlay = new D3HexbinGmapOverlay(GMAP.map, sampleset);
        GMAP.d3overlay = overlay;
    }
        GMAP.d3overlay.setMap(GMAP.map);
        console.log("ran sampler()");
    };
    sampler();
});
