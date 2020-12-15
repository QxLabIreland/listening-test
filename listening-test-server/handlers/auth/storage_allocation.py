import os

from bson import ObjectId
from pymongo.database import Database

from handlers.base import BaseHandler


class StorageAllocationHandler(BaseHandler):
    # Get storage that the usage of storage has been used by current user
    async def get(self):
        self.user_id = await self.auth_current_user()
        # TODO Test if this is gonna work
        medias_size, file_set = calculate_user_storage(self.db, self.user_id)
        self.dumps_write({'totalSize': medias_size, 'totalNum': len(file_set)})

    # Update storageAllocated for specific user
    async def patch(self):
        await self.auth_current_user('User')
        body = self.loads_body()
        # Find the user needs to be updated
        user = self.db['users'].find_one({'_id': body['_id']})
        user['storageAllocated'] = body['storageAllocated']
        self.db['users'].update({'_id': user['_id']}, {'$set': user})
        self.dumps_write(user)

def calculate_user_storage(db: Database, user_id: ObjectId):
    medias_size = 0
    file_set = set()
    # Get all collections and map data by user id
    for col in db.list_collection_names():
        data_list = db[col].aggregate([
            {'$match': {'userId': user_id}},
            {"$addFields": {"paths": {'$reduce': {
                'input': "$items.example.medias",
                'initialValue': [],
                'in': {'$concatArrays': ["$$value", "$$this.src"]}
            }}}},
            {'$project': {'paths': 1}},
            {'$unwind': '$paths'}
        ])
        # Map all files' addresses
        for path_obj in data_list:
            if 'paths' in path_obj and path_obj['paths']:
                fp = path_obj['paths'][1:]
                if os.path.exists(fp) and fp not in file_set:
                    # Build status for storage
                    medias_size += os.path.getsize(fp)
                    file_set.add(fp)
    return medias_size, file_set
