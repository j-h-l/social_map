""" Sends checkins on request

"""
from __future__ import print_function
import settings
from model.gowalla import GowallaUser, GowallaCheckin
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine.url import URL
from random import randint


class Picker(object):
    def __init__(self):
        """ Set up engine and session
        """
        self.engine = create_engine(URL(**settings.DATABASE))
        Session = sessionmaker(bind=self.engine)
        Session.configure(bind=self.engine)
        self.session = Session()
        self.totalUsers = self.session.query(GowallaUser)[-1].id

    def randomUser(self):
        properUser = False
        while not properUser:
            user = self.session.query(GowallaUser).join(GowallaCheckin)\
                    .filter(GowallaUser.id == randint(0, self.totalUsers)).first()
            properUser = type(user) == GowallaUser
        return user

    def pickUser(self, user_id):
        user = self.session.query(GowallaUser).join(GowallaCheckin)\
               .filter(GowallaUser.id == user_id).first()
        if type(user) == GowallaUser:
            return user
        else:
            print("Could not find user_id(%s). Returning random user." % user_id)
            return self.randomUser()

    def yield_user_checkins(self, user_id=None):
        if user_id:
            user = self.pickUser(user_id)
        else:
            user = self.randomUser()

        for eachcheckin in user.checkins:
            jfile = {"lat": float(eachcheckin.lat),
                     "lng": float(eachcheckin.lng),
                     "time": eachcheckin.checkin_time.strftime("%Y-%m-%d %H:%M:%S")}

            print(jfile)
            yield jfile
