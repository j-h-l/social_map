/*global $, google, d3 */

// D3 Hexbin Google Map OverlayLayer //
// --------------------------------- //
// var points, x, y, color; // Set globally so hexbin will take advantage of them
var D3HexbinGmapOverlay = function (map, checkinData) {
    'use strict';
    // Initialize
    this.refmap = map;
    this.checkinData = checkinData;
    this.width = $('#map-canvas').outerWidth();
    this.height = $('#map-canvas').outerHeight();
    this.color = d3.scale.linear()
                  // .domain([0, 20])
                  .domain([0,11])
                  .range(["white", "steelblue"])
                  .interpolate(d3.interpolateLab);
    this.hexbin = d3.hexbin()
                    .size([this.width, this.height])
                    .radius(20);
    this.hexbin.x(function (d) {
        // var overlayProjection = that.getProjection();
        var tempLatLng = new google.maps.LatLng(d.lat, d.lng);
        var relativePt = GMAP.d3overlay.getProjection().fromLatLngToContainerPixel(tempLatLng);
        return relativePt.x;
    });
    this.hexbin.y(function (d) {
        // var overlayProjection = that.getProjection();
        var tempLatLng = new google.maps.LatLng(d.lat, d.lng);
        var relativePt = GMAP.d3overlay.getProjection().fromLatLngToContainerPixel(tempLatLng);
        return relativePt.y;
    });
    // this.hexbin.x(function (d) { return d.lat; });
    // this.hexbin.y(function (d) { return d.lng; });
    this.setupDOM = function () {
        console.log("setupDOM triggered");
        var thisOverlayLayer = d3.select(this.getPanes().overlayLayer);
        // Define svg container
        var divsvg = thisOverlayLayer.select('svg');
        if (divsvg.empty()) {
            divsvg = thisOverlayLayer.append('svg');//.select('svg');
        }
        divsvg.attr("width", this.width)
              .attr("height", this.height);

        // Define clippath
        var divclippath = thisOverlayLayer.select('#clip');
        if (divclippath.empty()) {
            divclippath = thisOverlayLayer.select('svg').append('clipPath')
                                                        .attr('id', 'clip')
                                                        .append('rect')
                                                        .attr('class', 'mesh')
                                                        .attr('width', this.width)
                                                        .attr('height', this.height);
        }
    };
    // this.

    // trigger onAdd()
    this.setMap(map);
};

D3HexbinGmapOverlay.prototype = new google.maps.OverlayView();
D3HexbinGmapOverlay.prototype.onAdd = function () {
    // create dom objects and append as children of the pane
    'use strict';
    // alert("overlay onAdd triggered");
    console.log("onAdd triggered");
    var that = this;
    // this.overlayProjection = this.getProjection();
    that.setupDOM();
};
D3HexbinGmapOverlay.prototype.draw = function () {
    // position the elements
    // triggered whenever map property changes
    'use strict';
    // alert("overlay draw triggered");
    var that = this;
    console.log("overlay draw triggered");
    var divsvg = d3.select(that.getPanes().overlayLayer).select('svg');
    divsvg.append('g')
          .attr("clip-path", "url(#clip)")
          .selectAll(".hexagon")
          .data(that.hexbin(that.checkinData))//, function (d) { return [d.lat, d.lng]; })
          .enter()
          .append("path")
          .attr("class", "hexagon")
          .attr("d", that.hexbin.hexagon())
          .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
          .attr("opacity", "0.6")
          .style("fill", function (d) { return that.color(d.length); });
};
D3HexbinGmapOverlay.prototype.onRemove = function () {
    'use strict';
    d3.selectAll('.hexagon').remove();
};
// D3HexbinGmapOverlay.prototype.onRemove = function () {
//     // remove objects from the dom
//     // setMap(null) triggers this method
//     'use strict';
//     // alert("overlay onRemove triggered");
//     console.log("overlay onRemove triggered");
//     var that = this;
//     var hexes = d3.select('body').selectAll('.hexagon');
//     var toremove = hexes.data(that.hexbin(that.checkinData))
//                         .exit();
//     toremove.remove();
// };

var sampleset = [
    {lat: 37.7654, lng: -122.4744},
    {lat: 37.7941, lng: -122.4657},
    {lat: 37.7805, lng: -122.4598},
    {lat: 37.7846, lng: -122.4581},
    {lat: 37.7707, lng: -122.4423},
    {lat: 37.7798, lng: -122.4354},
    {lat: 37.7896, lng: -122.4341},
    {lat: 37.7704, lng: -122.4231},
    {lat: 37.7736, lng: -122.4097},
    {lat: 37.7817, lng: -122.4152},
    {lat: 37.7854, lng: -122.4099},
    {lat: 37.8011, lng: -122.4001},
    {lat: 37.7976, lng: -122.4095},
    {lat: 37.7946, lng: -122.3956},
    {lat: 37.7930, lng: -122.3948},
    {lat: 37.7913, lng: -122.3925},
    {lat: 37.7885, lng: -122.4004},
    {lat: 37.8012, lng: -122.3975},
    {lat: 37.7983, lng: -122.3949},
    {lat: 37.7961, lng: -122.4045},
    {lat: 37.7920, lng: -122.4006},
    {lat: 37.7888, lng: -122.3951},
    {lat: 37.7871, lng: -122.4057},
    {lat: 37.7841, lng: -122.4001},
    {lat: 37.79459, lng:  -122.40762},
    {lat: 37.79426, lng:  -122.40634},
    {lat: 37.79402, lng:  -122.40858},
    {lat: 37.79364, lng:  -122.40822},
    {lat: 37.79336, lng:  -122.40638},
    {lat: 37.79318, lng:  -122.40744},
    {lat: 37.79271, lng:  -122.40566},
    {lat: 37.79586, lng:  -122.40608},
    {lat: 37.79581, lng:  -122.40454},
    {lat: 37.79565, lng:  -122.40260},
    {lat: 37.79509, lng:  -122.40414},
    {lat: 37.79402, lng:  -122.40506}
];


var hexD3 = function () {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        // width = 960 - margin.left - margin.right,
        // height = 500 - margin.top - margin.bottom;
        width = $('#map-canvas').outerWidth() - margin.left - margin.right,
        height = $('#map-canvas').outerHeight() - margin.top - margin.bottom;


    var randomX = d3.random.normal(width / 2, 80),
        randomY = d3.random.normal(height / 2, 80),
        points = d3.range(2000).map(function() { return [randomX(), randomY()]; });

    var color = d3.scale.linear()
        .domain([0, 20])
        .range(["white", "steelblue"])
        .interpolate(d3.interpolateLab);

    var hexbin = d3.hexbin()
        .size([width, height])
        // .size([$('#map-canvas').outerWidth(), $('#map-canvas').outerHeight()])
        .radius(20);

    var x = d3.scale.identity()
        .domain([0, width]);

    var y = d3.scale.linear()
        .domain([0, height])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(6, -height);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(6, -width);

    svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("class", "mesh")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("clip-path", "url(#clip)")
      .selectAll(".hexagon")
        .data(hexbin(points))
      .enter().append("path")
        .attr("class", "hexagon")
        .attr("d", hexbin.hexagon())
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
        .style("fill", function (d) { return color(d.length); });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
// });
};
