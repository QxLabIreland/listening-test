import asyncio
import os
import sys
from tornado import web, ioloop, httpserver
from tornado.options import define, options
from mongodbconnection import create_default_user
from url import path

define("port", default=8889, help="run on the given port", type=int)
settings = dict(
    cookie_secret="61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
    xsrf_cookies=True,
    debug=True,
    static_path=os.path.join(os.path.dirname(__file__), "static2"),
    static_url_prefix='/static2/',
    xheaders=True,
)


# Operations and information before starting
def before_starting():
    create_default_user()


if __name__ == "__main__":
    # For python3.8 change event adminloop policy for windows
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    # Accept args, such as port
    options.parse_command_line()
    # Make an application based on path and settings
    app = httpserver.HTTPServer(web.Application(path, **settings))
    app.listen(options.port)
    before_starting()
    # Start tornado server
    print("The server is now on http://localhost:" + str(options.port))
    ioloop.IOLoop.instance().start()
