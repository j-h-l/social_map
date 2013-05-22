from __future__ import print_function
import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.template
import social_controller


class MainHandler(tornado.web.RequestHandler):
    """ Main """
    def get(self):
        here = tornado.template.Loader("./web/")
        self.write(here.load("index.html").generate())


class WeSoHandler(tornado.websocket.WebSocketHandler):
    """ Handler for websocket connection """
    def initialize(self):
        self.checkins = social_controller.Picker().yield_user_checkins()

    def open(self):
        self.get_them = tornado.ioloop.PeriodicCallback(self.delayed_yield, 500)
        self.get_them.start()

    def delayed_yield(self):
        try:
            checkin = self.checkins.next()
        except StopIteration:
            print("End of checkins, retrieving another user")
            self.initialize()
            checkin = self.checkins.next()
        if checkin:
            self.write_message(checkin)

    def on_close(self):
        self.get_them.stop()
        print("She's gone.")


application = tornado.web.Application([
    (r"/websocket", WeSoHandler),
    (r"/", MainHandler),
    (r"/src/(.*)", tornado.web.StaticFileHandler, {"path": "./web/src"}),
    (r"/assets/(.*)", tornado.web.StaticFileHandler, {"path": "./web/assets"}),
                                       ])

if __name__ == '__main__':
    application.listen(9999)
    ioloop = tornado.ioloop.IOLoop.instance()
    ioloop.start()
