# Visualization of social checkins #
Hex-binnified visualization layer over google maps

## Built using ##
### Python ###

* sqlalchemy - storing user checkins, frienship data into Postgresql

* alembic - versioned database migrations

* tornado - webserver, used to establish websocket connection


### Javascript ###

* jQuery - DOM manipulation

* Google Maps Javascript API v3

* D3 Hexbin overlay layer

![Screenshot](http://i.imgur.com/vzBbnPi.png)

* websocket connection

## WIP ##
* k-means ("where the party at?" :) )

* backbone.js

## Gowalla dataset structure ##
Dataset information (detail on license is provided in LICENSE)

Gowalla is a location-based social networking website where users share their locations by checking-in. The friendship network is undirected and was collected using their public API, and consists of 196,591 nodes and 950,327 edges. We have collected a total of 6,442,890 check-ins of these users over the period of Feb. 2009 - Oct. 2010.

Dataset statistics
Nodes 196,591
Edges 950,327
Check-ins 6,442,890

Source (citation)

E. Cho, S. A. Myers, J. Leskovec. Friendship and Mobility: Friendship and Mobility: User Movement in Location-Based Social Networks ACM SIGKDD International Conference on Knowledge Discovery and Data Mining (KDD), 2011.

Files

File  Description
loc-gowalla_edges.txt.gz  Friendship network of Gowalla users
loc-gowalla_totalCheckins.txt.gz  Time and location information of check-ins made by users

Example of check-in information

[user]  [check-in time]   [latitude]  [longitude] [location id]

196514  2010-07-24T13:45:06Z    53.3648119      -2.2723465833   145064

196514  2010-07-24T13:44:58Z    53.360511233    -2.276369017    1275991

## License ##
Copyright (c) <2013> <Jeehyung Lee>

Use it for good license.  I'm providing this source as it.  If you would like to use the ideas and source to better the world, you are free to take and use this however you see fit.


### Gowalla data provided by Stanford Large Network Dataset Collection ###

SNAP is distributed under the BSD license. This means that it is free for both academic and commercial use. Note however that some third party components in SNAP require that you reference certain works in scientific publications.

You are free build your code on top of SNAP. If do so, please reference (cite) SNAP and this website. We appreciate bug fixes and would be happy to include new modules in SNAP.

* Copyright (c) 2007-2012, Jure Leskovec
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*     * Redistributions of source code must retain the above copyright
*       notice, this list of conditions and the following disclaimer.
*     * Redistributions in binary form must reproduce the above copyright
*       notice, this list of conditions and the following disclaimer in the
*       documentation and/or other materials provided with the distribution.
*     * Neither the name of Stanford University nor the names of its contributors
*       may be used to endorse or promote products derived from this software
*       without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS ``AS IS'' AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.