/*global $, google, d3 */
/*jslint nomen: true */
var GMAP = {
    map: {},
    d3overlay: {},
    initialOptions: {
        zoom: 12,
        center: new google.maps.LatLng(37.7843, -122.3992),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
};


// d3js overlay //
// ------------ //
// not yet with d3js overlay - just plain image overlay
// testing overlay layer
var D3Overlay = function (bounds, overlayImage, map) {
    'use strict';
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
    'use strict';
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
    'use strict';
    var overlayProjection = this.getProjection();
    // var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var sw = overlayProjection.fromLatLngToContainerPixel(this.bounds_.getSouthWest());
    // var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
    var ne = overlayProjection.fromLatLngToContainerPixel(this.bounds_.getNorthEast());

    var div = this.div_;
    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
};

var g_initialize = function () {
    'use strict';
    GMAP.map = new google.maps.Map($('#map-canvas')[0], GMAP.initialOptions);
    // Bounds for overlay // todo: need to automate
    var swBound = new google.maps.LatLng(37.7831, -122.4114);
    var neBound = new google.maps.LatLng(37.7896, -122.4042);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);

    var overlayImage = "assets/testpin.png";
    GMAP.d3overlay = new D3Overlay(bounds, overlayImage, GMAP.map);
};
