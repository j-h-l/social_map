import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.template


class MainHandler(tornado.web.RequestHandler):
    """ Main """
    def get(self):
        here = tornado.template.Loader(".")
        self.write(here.load("index.html").generate())


class WeSoHandler(tornado.websocket.WebSocketHandler):
    """ Handler for websocket connection """
    def open(self):
        self.write_message("Nice to meet you!")

    def on_close(self):
        print "She's gone."


application = tornado.web.Application([
    (r"/websocket", WeSoHandler),
    (r"/", MainHandler),
    (r"/src/(.*)", tornado.web.StaticFileHandler, {"path": "./src"}),
                                       ])

if __name__ == '__main__':
    application.listen(9999)
    tornado.ioloop.IOLoop.instance().start()
