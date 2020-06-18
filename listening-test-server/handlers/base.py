import json

import bson
import tornado.web
from bson import ObjectId
from bson.json_util import dumps, loads
from mongodbconnection import MongoDBConnection, CJsonEncoder


class BaseHandler(tornado.web.RequestHandler):
    def __init__(self, application, request, **kwargs):
        super().__init__(application, request, **kwargs)
        self.user_id = None
        self.mongo_client = MongoDBConnection().client
        self.db = MongoDBConnection().db

    # When data received, it will be called before PUT and POST
    def data_received(self, chunk):
        pass

    # The connection start
    def prepare(self):
        pass

    def set_default_headers(self) -> None:
        self.set_header("Content-Type", "application/json")

    def on_finish(self):
        self.mongo_client.close()

    # TODO delete it Standard response. success 0, fail other number.
    async def write_res(self, code, info=None, data=None):
        data = {"code": code, "message": info, "data": data}
        json_data = json.dumps(data, cls=CJsonEncoder, ensure_ascii=False)
        # Unacceptable situation
        if code < 0:
            self.set_status(500, info)
        self.write(json_data)
        return json

    def dumps_write(self, data):
        json_data = dumps(data, json_options=bson.json_util.RELAXED_JSON_OPTIONS)
        self.write(json_data)

    def loads_body(self):
        body = self.request.body
        return loads(body, json_options=bson.json_util.RELAXED_JSON_OPTIONS)

    # If in the development, may need this function. For server side render
    # def set_default_headers(self):
    #     self.set_header("Access-Control-Allow-Origin", "http://localhost:4200")
    #     self.set_header("Access-Control-Allow-Headers", "x-requested-with")
    #     self.set_header('Access-Control-Allow-Methods', 'GET, OPTIONS')

    # if no login send 403, else return id with ObjectId
    def get_current_user(self):
        id_user = self.get_secure_cookie("_user", None)
        if not id_user:
            self.set_status(403)
            return None
        else:
            return ObjectId(id_user.decode("utf-8"))
