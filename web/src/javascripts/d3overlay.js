/*global $, google, d3 */

// D3 Hexbin Google Map OverlayLayer //
// --------------------------------- //
var D3HexbinGmapOverlay = function (map, checkinData) {
    'use strict';
    // Initialize
    this.refmap = map;
    this.checkinData = checkinData;
    this.width = $('#map-canvas').outerWidth();
    this.height = $('#map-canvas').outerHeight();
    this.color = d3.scale.linear()
                  .domain([0, 20])
                  .range(["white", "steelblue"])
                  .interpolate(d3.interpolateLab);
    this.hexbin = d3.hexbin()
                    .size([this.width, this.height])
                    .radius(20);
    this.setupDOM = function () {
        console.log("setupDOM triggered");
        var thisOverlayLayer = d3.select(this.getPanes().overlayLayer);
        // Define svg container
        var divsvg = thisOverlayLayer.select('svg');
        if (divsvg.empty()) {
            divsvg = thisOverlayLayer.append('svg').select('svg');
        }
        divsvg.attr("width", this.width)
              .attr("height", this.height);

        // Define clippath
        var divclippath = thisOverlayLayer.select('svg clipPath');
        if (divclippath.empty()) {
            divclippath = thisOverlayLayer.select('svg').append('clipPath')
                                                        .attr('id', 'clip')
                                                        .append('rect')
                                                        .attr('class', 'mesh')
                                                        .attr('width', this.width)
                                                        .attr('height', this.height);
        }
    };

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
    that.setupDOM();
    var divsvg = d3.select(that.getPanes().overlayLayer).select('svg');
    divsvg.append('g')
          .attr("clip-path", "url(#clip)")
          .selectAll(".hexagon")
          .data(that.hexbin(that.checkinData))
          .enter()
          .append("path")
          .attr("class", "hexagon")
          .attr("d", that.hexbin.hexagon())
          .attr("tranform", function (d) {return "translate(" + d.x + "," + d.y + ")"; })
          .style("fill", function (d) { return that.color(d.length); });
};
D3HexbinGmapOverlay.prototype.draw = function () {
    // position the elements
    // triggered whenever map property changes
    'use strict';
    // alert("overlay draw triggered");
    console.log("overlay draw triggered");
};
D3HexbinGmapOverlay.prototype.onRemove = function () {
    // remove objects from the dom
    // setMap(null) triggers this method
    'use strict';
    // alert("overlay onRemove triggered");
    console.log("overlay onRemove triggered");
};



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
