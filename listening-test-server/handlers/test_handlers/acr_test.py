from datetime import datetime
from bson import ObjectId
from handlers.base import BaseHandler


class AcrTestHandler(BaseHandler):
    def prepare(self):
        self.user_id = self.auth_current_user()
        # self.test_name + ' -> 'acr
        self.test_name = 'acr'

    async def get(self):
        _id = self.get_argument('_id', None)
        if not _id:
            # Get all test in created ASC order
            data = self.db[self.test_name + 'Tests'].aggregate([
                {'$match': {'userId': self.user_id}},
                {'$lookup': {'from': self.test_name + 'Surveys', 'let': {'testId': '$_id'}, 'pipeline': [
                    {'$match': {'$expr': {'$eq': ["$testId", "$$testId"]}}},
                    # {'$count': 'responsesNum'}
                ], 'as': 'responses'}},
                # {'$replaceRoot': {'newRoot': {'$mergeObjects': [{'$arrayElemAt': ['$responses', 0]}, "$$ROOT"]}}},
                {'$set': {'responseNum': {'$size': '$responses'}}},
                {'$project': {'responses': 0}},  # , 'items': 0, 'description': 0, 'settings': 0
                {'$sort': {'createdAt': -1}}
            ])
        else:
            # Get one test
            data = self.db[self.test_name + 'Tests'].find_one({'userId': self.user_id, '_id': ObjectId(_id)})
        self.dumps_write(data)

    async def post(self):
        body = self.loads_body()
        # Del some useless fields
        if '_id' in body:
            del body['_id']
        if 'responseNum' in body:
            del body['responseNum']
        if 'responses' in body:
            del body['responses']
        body['userId'] = self.user_id
        body['createdAt'] = datetime.now()
        _id = self.db[self.test_name + 'Tests'].insert(body)
        data = self.db[self.test_name + 'Tests'].find_one({'userId': self.user_id, '_id': ObjectId(_id)})
        self.dumps_write(data)

    async def put(self):
        body = self.loads_body()
        body['modifiedAt'] = datetime.now()
        data = self.db[self.test_name + 'Tests'].update_one({'userId': self.user_id, '_id': body['_id']}, {"$set": body}).raw_result
        self.dumps_write(data)

    async def delete(self):
        _id = ObjectId(self.get_argument('_id'))
        data = self.db[self.test_name + 'Tests'].delete_one({'_id': ObjectId(_id)}).raw_result
        self.db[self.test_name + 'Surveys'].delete_many({'testId': ObjectId(_id)})
        self.dumps_write(data)
