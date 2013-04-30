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
    def open(self):
        self.write_message("Nice to meet you!")
        # checkins = social_controller.Picker()


    def on_close(self):
        print "She's gone."


application = tornado.web.Application([
    (r"/websocket", WeSoHandler),
    (r"/", MainHandler),
    (r"/src/(.*)", tornado.web.StaticFileHandler, {"path": "./web/src"}),
                                       ])

if __name__ == '__main__':
    application.listen(9999)
    tornado.ioloop.IOLoop.instance().start()
