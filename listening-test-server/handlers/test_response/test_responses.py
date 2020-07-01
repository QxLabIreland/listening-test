from typing import Optional
import pymongo
from bson import ObjectId
from pymongo.collection import Collection
from handlers.base import BaseHandler


class TestResponsesHandler(BaseHandler):
    def prepare(self):
        self.user_id = self.auth_current_user()

    async def get(self):
        _id = self.get_argument('_id', None)
        collection = switch_response_collection(self)
        if not collection:
            return
        # Get a list or a response
        if not _id:
            test_id = self.get_argument('testId')
            data = collection.find({'userId': self.user_id, 'testId': ObjectId(test_id)}).sort('createdAt', pymongo.DESCENDING)
            # data = collection.find({'userId': self.user_id}).sort('createdAt', pymongo.DESCENDING)
        else:
            data = collection.find_one({'userId': self.user_id, '_id': ObjectId(_id)})
        self.dumps_write(data)

    async def delete(self):
        # Multiple deletion
        _ids = self.loads_body()
        collection = switch_response_collection(self)
        if not collection:
            return
        # Delete with a list
        for _id in _ids:
            collection.delete_one({'userId': self.user_id, '_id': _id})


def switch_response_collection(self: BaseHandler) -> Optional[Collection]:
    test_type = self.get_argument('testType')
    # Get right collection
    if test_type == 'abTest':
        return self.db['abTestSurveys']
    else:
        self.set_status(400, 'Invalid test type')
        return None
