import tornado.web

from handlers.administration.storage_allocation import calculate_user_storage
from handlers.base import BaseHandler
from tools import file_helper


class FileHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()

    # Upload files
    async def post(self):
        # Check the storage status first
        medias_size, _ = calculate_user_storage(self.db, self.user_id)
        current_user = self.db['users'].find_one({'_id': self.user_id})
        if 'storageAllocated' in current_user and medias_size > (current_user['storageAllocated'] or 524_288_000):
            self.set_error(400, 'You have reached your storage limit. '
                                'Please delete old or unused tests to free up space. '
                                'If you need more space than 500 MB email golisten@ucd.ie')
            raise tornado.web.Finish
        # Switch to different folder for different task
        if "audioFile" in self.request.files:
            file_metas = self.request.files["audioFile"]
            # Just use the first file
            url = file_helper.write_in_md5(file_metas[0], 'audio_files')
        elif 'imageFile' in self.request.files:
            file_metas = self.request.files['imageFile']
            url = file_helper.write_in_md5(file_metas[0], 'imageFile')
        elif 'videoFile' in self.request.files:
            file_metas = self.request.files['videoFile']
            url = file_helper.write_in_md5(file_metas[0], 'videoFile')
        else:
            self.set_error(400, 'Folder name is invalid')
            raise tornado.web.Finish
        self.write(url)
