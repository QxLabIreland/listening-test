from datetime import datetime
from typing import Optional
import pymongo
import tornado.web
from bson import ObjectId
from pymongo.collection import Collection
from handlers.base import BaseHandler


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
            json_file_name = f"{self.test_name}_Test-{datetime.now().strftime('%Y%m%d%H%M%S')}.json"
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


def switch_response_collection(self: BaseHandler, test_type: str) -> Optional[Collection]:
    # Get right collection
    if test_type == 'ab-test':
        return self.db['abSurveys']
    elif test_type == 'acr-test':
        return self.db['acrSurveys']
    elif test_type == 'mushra-test':
        return self.db['mushraSurveys']
    elif test_type == 'hearing-test':
        return self.db['hearingSurveys']
    elif test_type == 'audio-labeling':
        return self.db['audioLabelingSurveys']
    else:
        self.set_error(400, 'Invalid task url')
        raise tornado.web.Finish
