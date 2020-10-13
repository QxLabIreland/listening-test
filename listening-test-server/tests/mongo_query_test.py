import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
# db = client["golisten_db"]
db = client["listeningTestDb"]

data = db['test'].aggregate([
    {'$addFields': {'o': {'$objectToArray': "$$ROOT"}}},
    {"$addFields": {"list": {'$reduce': {
        'input': '$o.v.list',
        'initialValue': [],
        'in': {'$concatArrays': ["$$value", "$$this"]}
    }}}},
    {'$project': {'list': 1}},
])

for d in data:
    print(d)
