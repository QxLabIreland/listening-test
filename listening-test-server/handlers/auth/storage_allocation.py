import os

from handlers.base import BaseHandler


class StorageAllocationHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()

    # Get storage that the usage of storage has been used by current user
    async def get(self):
        # TODO Test if this is gonna work
        medias_size = 0
        file_set = set()
        # Get all collections and map data by user id
        for col in self.db.list_collection_names():
            data_list = self.db[col].aggregate([
                {'$match': {'userId': self.user_id}},
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
        self.dumps_write({'totalSize': medias_size, 'totalNum': len(file_set)})
