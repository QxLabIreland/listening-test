import os

from handlers.base import BaseHandler


class StorageAllocationHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()

    # Get storage that the usage of storage has been used by current user
    async def get(self):
        medias_size = 0
        medias_count = 0
        # Get all collections and map data by user id
        for col in self.db.list_collection_names():
            data_list = self.db[col].aggregate([
                {'$match': {'_id': self.user_id}},
                {"$addFields": {"paths": {'$reduce': {
                    'input': "$items.example.medias",
                    'initialValue': [],
                    'in': {'$concatArrays': ["$$value", "$$this.src"]}
                }}}},
                {'$project': {'paths': 1}},
                {'$unwind': '$paths'}
            ])
            for path_obj in data_list:
                if 'paths' in path_obj and path_obj['paths']:
                    fp = path_obj['paths'][1:]
                    if os.path.exists(fp):
                        medias_size += os.path.getsize(fp)
                        medias_count += 1
        self.dumps_write({'totalSize': medias_size, 'totalNum': medias_count})
