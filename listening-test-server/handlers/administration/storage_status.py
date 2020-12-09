import os
from collections import namedtuple

from pymongo.database import Database
from handlers.base import BaseHandler
from tools.file_helper import sizeof_fmt


class StorageStatusHandler(BaseHandler):
    storage_folder = ['static2/audio_files', 'static2/audio_files', 'static2/videoFile']

    async def prepare(self):
        # Get user and check the permissions
        self.user_id = await self.auth_current_user('Storage')

    # Get general storage status of the system
    async def get(self):
        medias_checklist = get_medias_in_using(self.db)
        storage_status_dto = {'totalSize': 0, 'totalNum': 0, 'redundantSize': 0}
        # Get size of static folder
        for target_path in StorageStatusHandler.storage_folder:
            path_usage = get_space_usage(target_path, medias_checklist)
            if path_usage:
                for key, value in path_usage.items():
                    storage_status_dto[key] += value

        self.dumps_write({
            'totalSize': sizeof_fmt(storage_status_dto['totalSize']),
            'totalNum': storage_status_dto['totalNum'],
            'redundantSize': sizeof_fmt(storage_status_dto['redundantSize'])
        })

    # Delete unused files
    async def delete(self):
        medias_checklist = get_medias_in_using(self.db)
        total_size = 0
        total_num = 0

        for target_path in StorageStatusHandler.storage_folder:
            if not os.path.exists(target_path):
                continue
            for f in os.listdir(target_path):
                # Check if file has been used, if it has then delete it
                if f not in medias_checklist:
                    os.remove(os.path.join(target_path, f))
                else:
                    # Add size and increase number
                    total_size += os.path.getsize(os.path.join(target_path, f))
                    total_num += 1

        self.dumps_write({
            'totalSize': sizeof_fmt(total_size),
            'totalNum': total_num,
            'redundantSize': 0
        })


def get_medias_in_using(db: Database) -> set:
    medias_checklist = set()
    # Get all collections and map data
    for col in db.list_collection_names():
        data_list = db[col].aggregate([
            {"$addFields": {"listSrc": {'$reduce': {
                'input': "$items.example.medias",
                'initialValue': [],
                'in': {'$concatArrays': ["$$value", "$$this.src"]}
            }}}},
            {'$project': {'listSrc': 1}},
            {'$match': {'listSrc.0': {'$exists': True}}}
        ])
        for d in data_list:
            for src in d['listSrc']:
                if src:
                    medias_checklist.add(os.path.split(src)[-1])

    return medias_checklist


def get_space_usage(target_path, db_medias_checklist):
    size = 0
    count = 0
    redundant_size = 0
    if not os.path.exists(target_path):
        return None
    # Walk the target direction
    for dirpath, dirnames, filenames in os.walk(target_path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            # skip if it is symbolic link
            if not os.path.islink(fp):
                f_size = os.path.getsize(fp)
                size += f_size
                count += 1
                # If a file is not in use, mark it as redundant
                if f not in db_medias_checklist:
                    redundant_size += f_size

    return {'totalSize': size, 'totalNum': count, 'redundantSize': redundant_size}
