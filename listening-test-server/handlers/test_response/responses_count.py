from typing import Optional
import pymongo
from bson import ObjectId
from pymongo.collection import Collection
from handlers.base import BaseHandler
from handlers.test_response.test_responses import switch_response_collection


class ResponsesCountHandler(BaseHandler):
    def prepare(self):
        self.user_id = self.auth_current_user()

    async def get(self):
        test_id = self.get_argument('testId')
        collection = switch_response_collection(self)
        responses_count = collection.find({'userId': self.user_id, 'testId': ObjectId(test_id)}).count()
        self.dumps_write(responses_count)
