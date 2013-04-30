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

    def yield_user_checkins(self, random=True, user_id=None):
        while random:
            try:
                user = self.session.query(GowallaUser).join(GowallaCheckin)\
                      .filter(GowallaUser.id == randint(0, self.totalUsers)).first()
                break
            except:
                print("No user found by random id. Trying again.")
                pass
        if user_id:
            try:
                user = self.session.query(GowallaUser).join(GowallaCheckin)\
                        .filter(GowallaUser.id == user_id).first()
            except:
                print("User not found. Please check the user id and try again.")
                raise

        for eachcheckin in user.checkins:
            yield (eachcheckin.lat, eachcheckin.lng, eachcheckin.checkin_time)
