import os

from handlers.base import BaseHandler


class StorageStatusHandler(BaseHandler):
    storage_folder = ['static2/audio_files', 'static2/imageFile', 'static2/videoFile']

    async def prepare(self):
        # Get user and check the permissions
        self.user_id = await self.auth_current_user('Storage')

    # Get general storage status of the system
    async def get(self):
        medias_checklist = self.get_medias_in_using()
        storage_status_dto = {'totalSize': 0, 'totalNum': 0, 'redundantSize': 0}
        # Get size of static folder
        for target_path in StorageStatusHandler.storage_folder:
            path_usage = get_space_usage(target_path, medias_checklist)
            if path_usage:
                for key, value in path_usage.items():
                    storage_status_dto[key] += value

        self.dumps_write({
            'totalSize': storage_status_dto['totalSize'],
            'totalNum': storage_status_dto['totalNum'],
            'redundantSize': storage_status_dto['redundantSize']
        })

    # Delete unused files
    async def delete(self):
        medias_checklist = self.get_medias_in_using()
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
            'totalSize': total_size,
            'totalNum': total_num,
            'redundantSize': 0
        })

    # Get all media files in using of all the users
    def get_medias_in_using(self) -> set:
        medias_checklist = set()
        # Get all collections and map data
        for col in self.db.list_collection_names():
            data_list = self.db[col].aggregate([
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
    """
    Get the usage of the path including total size, num of files and the size of redundant files
    :param target_path: The path store files
    :param db_medias_checklist: A list of filenames that is being used by tests or responses
    :return: A dict contains totalSize, totalNum and redundantSize
    """
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
