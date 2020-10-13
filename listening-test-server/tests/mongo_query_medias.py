import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["golisten_db"]
# db = client["listeningTestDb"]

medias = set()

for col in db.list_collection_names():

    data = db[col].aggregate([
        {"$addFields": {"list": {'$reduce': {
            'input': "$items.example.medias",
            'initialValue': [],
            'in': {'$concatArrays': ["$$value", "$$this.src"]}
        }}}},
        {'$project': {'list': 1}},
        {'$match': {'list.0': {'$exists': True}}}
    ])
    print(col)
    for d in data:
        print(d)

    # for d in data:
    #     print(d)
    #     if 'items' in d and d['items']:
    #         for i in d['items']:
    #             if 'example' in i and i['example'] and 'medias' in i['example']:
    #                 for a in i['example']['medias']:
    #
    #                     medias.add(a['src'])

print(medias, len(medias))
