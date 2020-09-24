import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["golisten_db"]
# db = client["listeningTestDb"]

medias = set()

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

    # data = db[col].find({}, {'items.example.audios.src': 1})
    #
    # for d in data:
    #     print(d)
    #     if 'items' in d and d['items']:
    #         for i in d['items']:
    #             if 'example' in i and i['example'] and 'medias' in i['example']:
    #                 for a in i['example']['medias']:
    #
    #                     medias.add(a['src'])

print(medias, len(medias))
