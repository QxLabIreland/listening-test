import asyncio
import os
import sys
import tornado
from tornado import web, ioloop, httpserver
from tornado.options import define, options
from mongodbconnection import create_default_user
from url import path

define("port", default=8888, help="run on the given port", type=int)


class Application(tornado.web.Application):
    def __init__(self):
        settings = dict(
            cookie_secret="61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
            xsrf_cookies=True,
            login_url="/login",
            debug=True,
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            xheaders=True,
        )
        super(Application, self).__init__(path, **settings)


if __name__ == "__main__":
    # For python3.8 change event adminloop policy for windows
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    # operations and information before starting
    create_default_user()
    print("The server is now on http://localhost:8888")
    tornado.ioloop.IOLoop.instance().start()
