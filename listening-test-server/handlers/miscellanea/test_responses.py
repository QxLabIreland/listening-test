from typing import Optional
import pymongo
from bson import ObjectId
from pymongo.collection import Collection
from handlers.base import BaseHandler


class TestResponsesHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()

    async def get(self):
        _id = self.get_argument('_id', None)
        collection = switch_response_collection(self)
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
        self.dumps_write(data)

    async def delete(self):
        _ids = self.loads_body()
        collection = switch_response_collection(self)
        if not collection:
            return
        # Multiple deletion
        result = collection.delete_many({'userId': self.user_id, '_id': {'$in': _ids}})
        self.dumps_write(result.raw_result)


def switch_response_collection(self: BaseHandler) -> Optional[Collection]:
    test_type = self.get_argument('testType')
    # Get right collection
    if test_type == 'ab-test':
        return self.db['abSurveys']
    elif test_type == 'acr-test':
        return self.db['acrSurveys']
    elif test_type == 'mushra-test':
        return self.db['mushraSurveys']
    elif test_type == 'hearing-test':
        return self.db['hearingSurveys']
    else:
        return None
