from datetime import datetime

from bson import ObjectId
from handlers.base import BaseHandler


class AcrSurveyHandler(BaseHandler):
    def prepare(self):
        self.taskCollectionName = 'acrTests'
        self.surveyCollectionName = 'acrSurveys'

    async def get(self):
        _id = self.get_argument('_id')
        data = self.db[self.taskCollectionName].find_one({'_id': ObjectId(_id)},
                                                          {'_id': 0, 'createdAt': 0, 'modifiedAt': 0})
        # Add testId field, it will appear in response after user's submission
        data['testId'] = ObjectId(_id)
        self.dumps_write(data)

    async def post(self):
        body = self.loads_body()
        body['createdAt'] = datetime.now()
        result = self.db[self.surveyCollectionName].insert_one(body)
        self.dumps_write(result.inserted_id)

    async def delete(self):
        _id = self.get_argument('_id')

        result = self.db[self.surveyCollectionName].delete_one({'_id': ObjectId(_id)})
        self.dumps_write(result.raw_result)
