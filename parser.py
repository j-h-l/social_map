from __future__ import print_function
import csv
import os

import json
import requests


class GowallaData(object):
    """Parser for Gowalla data
       Data provided by Stanford Large Network Dataset Collection
    """

    def __init__(self, data=None):
        self.data = data

    def parse_to_septxt(self):
        """Parse data into separate files according to userid
        """
        if self.data is None:
            print("Init with data")
            return

        f = open(self.data, 'r')
        mycsv = csv.reader(f, delimiter='\t')
        for event in mycsv:
            userid = event[0]
            userpath = "userdata/" + str(userid)
            ev = '\t'.join(event[:-1])
            if not os.path.exists('userdata/'):
                os.makedirs('userdata/')

            if os.path.exists(userpath):
                with open(userpath, 'a') as uf:
                    print(ev, file=uf)
            else:
                with open(userpath, 'w') as uf:
                    print(ev, file=uf)
        print("Finished parsing.")


def letsrunthis(f):
    """ Run parser
    :f: checkin data from gowalla
    """
    gowalla = GowallaData(f)
    gowalla.parse_to_septxt()

if __name__ == '__main__':
    f = "loc-gowalla_totalCheckins.txt"
    letsrunthis(f)
