import decimal
import json
from datetime import datetime, date, timedelta
import bson
import pymongo
from tools.constants import permission_list


class CJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        elif isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        elif isinstance(obj, timedelta):
            return str(obj)
        elif isinstance(obj, bson.ObjectId):
            return str(obj)
        else:
            return json.JSONEncoder.default(self, obj)


class MongoDBConnection:
    def __init__(self):
        try:
            self.client = pymongo.MongoClient("mongodb://localhost:27017/")
            self.db = self.client["golisten_db"]
        except():
            print(Exception)


def create_default_user():
    con = MongoDBConnection()
    # user default seed
    default_user = {
        'name': 'admin',
        'password': 'e10adc3949ba59abbe56e057f20f883e',
        'email': 'admin@yourdomain.com',
        'isAdmin': True,
        'permissions': permission_list
    }
    admin = con.db['users'].find_one({'isAdmin': True})
    if not admin:
        con.db['users'].insert(default_user)
        print('default admin user created')
    elif admin['permissions'] != permission_list:
        con.db['users'].update_one({'_id': admin['_id']}, {'$set': {'permissions': permission_list}})
        print('admin permissions updated')
