"""
Google maps request
Plots data on google map
"""
from __future__ import print_function
import requests
from PIL import Image
from StringIO import StringIO
import os
from random import random
import math


class GoogleMaps(object):
    """ Static map from Google Maps

        Todo: extend this to request interactive map in javascript
              create overlay layer - request url is limited to 2048 char
    """

    def __init__(self, center="37.783,-122.399", zoom=16, imgsize="640x360",
                 imgformat="png", maptype="roadmap", a_markers=None):
        self.center = center
        self.zoom = zoom
        self.imgsize = imgsize
        self.imgformat = imgformat
        self.maptype = maptype
        # if isinstance(center, str):
            # lat, lng = center.split(',')
        # self.markers = [(lat, lng)]
        self.markers = []
        if not a_markers is None:
            self.markers.append(a_markers)

    def requestMap(self, markers=None, implicit_zoom=False):
        REQUESTURL = "http://maps.googleapis.com/maps/api/staticmap?"
        reqpath = REQUESTURL

        if implicit_zoom is False:
            reqpath += "center=%s" % self.center + "&"
            reqpath += "zoom=%i" % self.zoom + "&"

        reqpath += "size=%s" % self.imgsize + "&"
        reqpath += "format=%s" % self.imgformat + "&"
        reqpath += "maptype=%s" % self.maptype + "&"
        reqpath += self.prepareMarkers(markers)
        reqpath += "sensor=false"
        print("Length of request path: %i" % len(reqpath))
        if len(reqpath) >= 2048:
            print("Static map request url is limited to 2048 characters.")
            return None
        r = requests.get(reqpath)
        if r.status_code == requests.codes.ok:
            return r
        else:
            print("Request failed with code: %s" % r.status_code)
            return None

    def prepareMarkers(self, additional_markers=None):
        """ returns string for google map request
        """
        markerstring = "markers="
        markerstring += "color:" + "blue"
        for mark in self.markers:
            markerstring += "|" + str(mark[0]) + "," + str(mark[1])
        # import pdb; pdb.set_trace()
        if not additional_markers is None:
            for mark in additional_markers:
                markerstring += "|" + str(mark[0]) + "," + str(mark[1])
        markerstring += "&"
        return markerstring


def loaduser(user):
    """ Reads user checkin data

    :user: @todo
    :returns: List of checkins (latitude, longitude)

    """
    userfile = str(user)
    print("User file opened: %s" % userfile)
    fpath = os.path.join("userdata", userfile)
    markers = []
    if os.path.exists(fpath):
        with open(fpath, 'r') as u:
            for line in u:
                f = line[:-2].split('\t')
                print((f[2], f[3]))
                markers.append((f[2], f[3]))
        print("Number of checkins: %i" % len(markers))
        return markers
    else:
        print("User does not exist")
        return None


def main():
    # tests
    testrequest = GoogleMaps()
    res = testrequest.requestMap()
    i = Image.open(StringIO(res.content))
    i.save("testmap" + ".png", "PNG")

    these = [(37.78380, -122.39947), (37.78355, -122.39811),
             (37.78313, -122.39866)]
    another = testrequest.requestMap(markers=these)
    i2 = Image.open(StringIO(another.content))
    i2.save("testmap2" + ".png", "PNG")

    user = int(math.floor(random() * 196586))
    user_mark = loaduser(user)
    usertest = GoogleMaps()
    userreq = usertest.requestMap(implicit_zoom=True, markers=user_mark)
    i3 = Image.open(StringIO(userreq.content))
    i3.save("testmap3" + ".png", "PNG")

if __name__ == '__main__':
    main()
