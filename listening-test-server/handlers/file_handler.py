import tornado.web

from handlers.base import BaseHandler
from tools import file_helper


class FileHandler(BaseHandler):
    async def prepare(self):
        await self.auth_current_user()

    # Upload files
    async def post(self):
        # TODO Check the storage status first
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
