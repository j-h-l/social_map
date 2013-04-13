from __future__ import print_function
import requests
from PIL import Image
from StringIO import StringIO


class GoogleMaps(object):
    """ Static map from Google Maps

        Todo: extend this to request interactive map in javascript
    """

    def __init__(self, center="37.783,-122.399", zoom=16, imgsize="640x360",
                 imgformat="png", maptype="roadmap", a_markers=None):
        self.center = center
        self.zoom = zoom
        self.imgsize = imgsize
        self.imgformat = imgformat
        self.maptype = maptype
        if isinstance(center, str):
            lat, lng = center.split(',')
        self.markers = [(lat, lng)]
        if not a_markers is None:
            self.markers.append(a_markers)

    def requestMap(self, zoom=16, markers=None):
        REQUESTURL = "http://maps.googleapis.com/maps/api/staticmap?"

        reqpath = REQUESTURL + "center=%s" % self.center + "&"
        reqpath += "zoom=%i" % zoom + "&"
        reqpath += "size=%s" % self.imgsize + "&"
        reqpath += "format=%s" % self.imgformat + "&"
        reqpath += "maptype=%s" % self.maptype + "&"
        reqpath += self.prepareMarkers(markers)
        reqpath += "sensor=false"
        r = requests.get(reqpath)
        if r.status_code == requests.codes.ok:
            return r
        else:
            print("Request failed with code: %s" % r.status_code)

    def prepareMarkers(self, additional_markers=None):
        """ returns string for google map request
        """
        markerstring = "markers="
        markerstring += "color:" + "blue"
        for mark in self.markers:
            markerstring += "|" + str(mark[0]) + "," + str(mark[1])
        import pdb; pdb.set_trace()
        if not additional_markers is None:
            for mark in additional_markers:
                markerstring += "|" + str(mark[0]) + "," + str(mark[1])
        markerstring += "&"
        return markerstring


def main():
    testrequest = GoogleMaps()
    res = testrequest.requestMap()
    i = Image.open(StringIO(res.content))
    i.save("testmap" + ".png", "PNG")

    these = [(37.78380, -122.39947), (37.78355, -122.39811),
             (37.78313, -122.39866)]
    another = testrequest.requestMap(markers=these)
    i2 = Image.open(StringIO(another.content))
    i2.save("testmap2" + ".png", "PNG")

if __name__ == '__main__':
    main()
