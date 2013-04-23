"""
Social data visualization

Parses data into postresql database and/or separate txt files
"""
from __future__ import print_function
import csv
import os
import dateutil.parser as p
from model.base import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.engine.url import URL
import datetime
from model.gowalla import GowallaUser, GowallaCheckin

import settings

# Todo: parser for twitter data
#       parser for foursquare data


class GowallaData(object):
    """Parser for Gowalla data
       Data provided by Stanford Large Network Dataset Collection
    """

    def __init__(self, data=None):
        self.data = data

    def each_checkin(self):
        """ Yields each checkins from data
        """
        if self.data is None:
            print("Init with data")
            yield None

        f = open(self.data, 'r')
        mycsv = csv.reader(f, delimiter='\t')
        for event in mycsv:
            yield event

    def parse_to_septxt(self):
        """ Parse data into separate files according to userid
        """
        mycsv = self.each_checkin()
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

    def parse_to_database(self, settings):
        """ Parse data into database
        """
        # Setup database
        engine = create_engine(URL(**settings.DATABASE))
        Base.metadata.create_all(engine)

        import pdb; pdb.set_trace()
        mycsv = self.each_checkin()
        print("Starting adding to db.  Might take a while.")
        for event in mycsv:
            session = Session(bind=engine)
            user_id = event[0]
            checkin_time = datetime.datetime.strptime( \
                            str(event[1]), "%Y-%m-%dT%H:%M:%SZ")
            lat = event[2]
            lng = event[3]
            checkid = session.query(GowallaUser).filter_by(id=user_id).all()
            if len(checkid) == 0:
                try:
                    session.add(GowallaUser(id=user_id))
                except:
                    pass

            try:
                session.add(GowallaCheckin(lat=lat, lng=lng,
                                           checkin_time=checkin_time,
                                           user_id=user_id))
            except:
                session.rollback()
                print("Could not add: %s" % event)
                raise
            finally:
                session.commit()
                session.close()

        print("Done.")




def letsrunthis(f):
    """ Run parser
    :f: checkin data from gowalla
    """
    gowalla = GowallaData(f)
    # gowalla.parse_to_septxt()
    database_settings = settings
    gowalla.parse_to_database(database_settings)

if __name__ == '__main__':
    f = "data/loc-gowalla_totalCheckins.txt"
    letsrunthis(f)
