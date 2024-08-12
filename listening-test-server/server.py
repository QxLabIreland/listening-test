import asyncio
import os
import sys

from tornado import web, ioloop, httpserver
from tornado.options import options, define, Error
from mongodbconnection import create_default_user
from url import path

try:
    define("port", default=8889, help="run on the given port", type=int)
except Error:
    print("The server is now on http://localhost:", options.port)

debug = sys.platform == "win32"
settings = dict(
    cookie_secret="61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
    xsrf_cookies=True,
    debug=debug,
    autoreload=not debug,  # To use autoreload from python debuggger
    static_path=os.path.join(os.path.dirname(__file__), "static2"),
    static_url_prefix="/static2/",
    xheaders=True,
)


if __name__ == "__main__":
    # For python3.8 change event adminloop policy for windows
    if debug:
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    # Accept args, such as port
    options.parse_command_line()
    application = web.Application(path, **settings)
    # Make an application based on path and settings
    app_server = httpserver.HTTPServer(application)
    app_server.listen(options.port)
    # Operations and information before starting
    create_default_user()

    # Start tornado server
    print("The server is now on http://localhost:", options.port)
    ioloop.IOLoop.instance().start()
