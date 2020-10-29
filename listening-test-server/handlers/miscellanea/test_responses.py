from datetime import datetime
import pymongo
from bson import ObjectId
from handlers.base import BaseHandler
from handlers.miscellanea.task_name_mapping import switch_response_collection


class TestResponsesHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()

    async def get(self):
        _id = self.get_argument('_id', None)
        # Downloadable is not a necessary parameter
        downloadable = self.get_argument('downloadable', None)
        test_type = self.get_argument('testType')
        collection = switch_response_collection(self, test_type)
        if not collection:
            self.set_error(400, 'Invalid test type')
            return
        # Get a list or a response
        if not _id:
            test_id = self.get_argument('testId')
            data = collection.find({'userId': self.user_id, 'testId': ObjectId(test_id)}).sort(
                'createdAt', pymongo.DESCENDING)
            # data = collection.find({'userId': self.user_id}).sort('createdAt', pymongo.DESCENDING)
        else:
            data = collection.find_one({'userId': self.user_id, '_id': ObjectId(_id)})
        # Check if the responses are downloadable
        if downloadable:
            json_file_name = f"{test_type}-{datetime.now().strftime('%Y%m%d%H%M%S')}.json"
            # Set http response header for downloading file
            self.set_header('Content-Type', 'application/octet-stream')
            self.set_header('Content-Disposition', f'attachment; filename="{json_file_name}"')
        # If it is downloadable, we will need 2 intent
        self.dumps_write(data, 2 if downloadable else None)

    async def delete(self):
        _ids = self.loads_body()
        test_type = self.get_argument('testType')
        collection = switch_response_collection(self, test_type)
        if not collection:
            return
        # Multiple deletion
        result = collection.delete_many({'userId': self.user_id, '_id': {'$in': _ids}})
        self.dumps_write(result.raw_result)


