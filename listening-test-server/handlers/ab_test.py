from datetime import datetime
from bson import ObjectId
from handlers.base import BaseHandler


class AbTestHandler(BaseHandler):
    def prepare(self):
        self.user_id = self.get_current_user()

    async def get(self):
        _id = self.get_argument('_id', None)
        if not _id:
            # Get all test in created ASC order
            data = self.db['abTests'].aggregate([
                {'$match': {'userId': self.user_id}},
                {'$lookup': {'from': "abTestSurveys", 'let': {'abTestId': '$_id'}, 'pipeline': [
                    {'$match': {'$expr': {'$eq': ["$abTestId", "$$abTestId"]}}},
                    {'$project': {'_id': 1}}
                ], 'as': "responses"}},
                # {'$group': {'_id': "$responses", "numOfStudent": {'$sum': 1}}},
                {'$project': {'survey': 0}},
                {'$sort': {'createdAt': -1}}
            ])
        else:
            # Get one test
            data = self.db['abTests'].find_one({'userId': self.user_id, '_id': ObjectId(_id)})
        self.dumps_write(data)

    async def post(self):
        body = self.loads_body()
        body['userId'] = self.user_id
        body['createdAt'] = datetime.now()
        _id = self.db['abTests'].insert(body)
        self.dumps_write(_id)

    async def put(self):
        body = self.loads_body()
        body['modifiedAt'] = datetime.now()
        data = self.db['abTests'].update_one({'userId': self.user_id, '_id': body['_id']}, {"$set": body}).raw_result
        self.dumps_write(data)

    async def delete(self):
        _id = ObjectId(self.get_argument('_id'))
        data = self.db['abTests'].delete_one({'_id': ObjectId(_id)}).raw_result
        self.dumps_write(data)
