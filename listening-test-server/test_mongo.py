import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
# db = client["golisten_db"]
db = client["listeningTestDb"]

audios = set()

for col in db.list_collection_names():

    data = db[col].find({}, {'items.example.audios.src': 1})

    for d in data:
        print(d)
        if 'items' in d and d['items']:
            for i in d['items']:
                if 'example' in i and i['example'] and 'audios' in i['example']:
                    for a in i['example']['audios']:

                        audios.add(a['src'])

print(audios, len(audios))
