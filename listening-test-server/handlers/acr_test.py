from datetime import datetime
from bson import ObjectId
from handlers.base import BaseHandler


class AcrTestHandler(BaseHandler):
    def prepare(self):
        self.user_id = self.auth_current_user()

    async def get(self):
        _id = self.get_argument('_id', None)
        if not _id:
            # Get all test in created ASC order
            data = self.db['acrTests'].aggregate([
                {'$match': {'userId': self.user_id}},
                {'$lookup': {'from': 'acrSurveys', 'let': {'testId': '$_id'}, 'pipeline': [
                    {'$match': {'$expr': {'$eq': ["$testId", "$$testId"]}}},
                    {'$project': {'_id': 1}}
                ], 'as': 'responses'}},
                # {'$group': {'_id': "$responses", "numOfStudent": {'$sum': 1}}},
                {'$project': {'survey': 0}},
                {'$sort': {'createdAt': -1}}
            ])
        else:
            # Get one test
            data = self.db['acrTests'].find_one({'userId': self.user_id, '_id': ObjectId(_id)})
        self.dumps_write(data)

    async def post(self):
        body = self.loads_body()
        if '_id' in body:
            del body['_id']
        body['userId'] = self.user_id
        body['createdAt'] = datetime.now()
        _id = self.db['acrTests'].insert(body)
        self.dumps_write(_id)

    async def put(self):
        body = self.loads_body()
        body['modifiedAt'] = datetime.now()
        data = self.db['acrTests'].update_one({'userId': self.user_id, '_id': body['_id']}, {"$set": body}).raw_result
        self.dumps_write(data)

    async def delete(self):
        _id = ObjectId(self.get_argument('_id'))
        data = self.db['acrTests'].delete_one({'_id': ObjectId(_id)}).raw_result
        self.dumps_write(data)

