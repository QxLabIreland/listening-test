from bson import ObjectId
from handlers.base import BaseHandler
from handlers.miscellanea.task_name_mapping import switch_response_collection


class ResponsesCountHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()

    # Count the number of responses
    async def get(self):
        test_id = self.get_argument('testId')
        test_type = self.get_argument('testType')
        collection = switch_response_collection(self, test_type)
        responses_count = collection.find({'userId': self.user_id, 'testId': ObjectId(test_id)}).count()
        self.dumps_write(responses_count)
