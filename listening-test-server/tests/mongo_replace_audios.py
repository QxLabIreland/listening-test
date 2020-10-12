import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["golisten_db"]

for col in db.list_collection_names():
    db[col].update_many({}, [{'$set': {"items": {'$map': {
        'input': "$items",
        'as': "item",
        'in': {
            'example': {
                'fields': "$$item.example.fields",
                'tags': "$$item.example.tags",
                'settings': "$$item.example.settings",
                'medias': "$$item.example.audios",
                'mediaRef': "$$item.example.audioRef"
            },
            'id': '$$item.id',
            'type': '$$item.type',
            'title': '$$item.title',
            'questionControl': '$$item.questionControl',
            'time': '$$item.time',
            'collapsed': '$$item.collapsed',
        }
    }}}}])
