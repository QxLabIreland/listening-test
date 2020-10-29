from datetime import datetime
from uuid import uuid4

from bson import ObjectId

from handlers.base import BaseHandler
from handlers.miscellanea.task_name_mapping import get_task_url_by_collection


class AcrTestHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()
        self.taskCollectionName = 'acrTests'
        self.surveyCollectionName = 'acrSurveys'

    async def get(self):
        _id = self.get_argument('_id', None)
        if not _id:
            # Get all test in created ASC order
            data = self.db[self.taskCollectionName].aggregate([
                {'$match': {'userId': self.user_id}},
                {'$lookup': {'from': self.surveyCollectionName, 'let': {'testId': '$_id'}, 'pipeline': [
                    {'$match': {'$expr': {'$eq': ["$testId", "$$testId"]}}},
                    # {'$count': 'responsesNum'}
                ], 'as': 'responses'}},
                # {'$replaceRoot': {'newRoot': {'$mergeObjects': [{'$arrayElemAt': ['$responses', 0]}, "$$ROOT"]}}},
                {'$set': {'responseNum': {'$size': '$responses'}}},
                {'$project': {'responses': 0}},  # , 'items': 0, 'description': 0, 'settings': 0
                {'$sort': {'createdAt': -1}}
            ])
        else:
            # Get one test, if there is no data we gonna look for it in templates
            data = self.db[self.taskCollectionName].find_one({'userId': self.user_id, '_id': ObjectId(_id)})
            if not data:
                data = self.db[self.taskCollectionName].find_one({'_id': ObjectId(_id), 'isTemplate': True})
            if not data:
                self.set_error(404, 'Test not found')
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
        _id = self.db[self.taskCollectionName].insert(body)
        # Find the inserted test
        data = self.db[self.taskCollectionName].find_one({'userId': self.user_id, '_id': ObjectId(_id)})
        self.dumps_write(data)

    async def put(self):
        body = self.loads_body()
        # Add modification date
        body['modifiedAt'] = datetime.now()
        result = self.db[self.taskCollectionName].update_one(
            {'userId': self.user_id, '_id': body['_id']}, {"$set": body})
        self.dumps_write(result.raw_result)

    async def delete(self):
        _id = ObjectId(self.get_argument('_id'))
        result = self.db[self.taskCollectionName].delete_one({'_id': ObjectId(_id)})
        # Delete related surveys
        self.db[self.surveyCollectionName].delete_many({'testId': ObjectId(_id)})
        self.dumps_write(result.raw_result)


class AcrSurveyHandler(BaseHandler):
    def prepare(self):
        self.taskCollectionName = 'acrTests'
        self.surveyCollectionName = 'acrSurveys'

    async def get(self):
        _id = self.get_argument('_id')
        data = self.db[self.taskCollectionName].find_one(
            {'_id': ObjectId(_id)}, {'_id': 0, 'createdAt': 0, 'modifiedAt': 0}
        )
        # Add testId field, it will appear in response after user's submission
        data['testId'] = ObjectId(_id)
        self.dumps_write(data)

    async def post(self):
        body = self.loads_body()
        body['createdAt'] = datetime.now()
        result = self.db[self.surveyCollectionName].insert_one(body)
        self.dumps_write(result.inserted_id)

    # The method that subject delete their own response
    async def delete(self):
        _id = self.get_argument('_id')
        # For message
        response = self.db[self.surveyCollectionName].find_one({'_id': ObjectId(_id)})
        result = self.db[self.surveyCollectionName].delete_one({'_id': ObjectId(_id)})
        # Insert a message for user
        if response:
            message = {
                'id': str(uuid4()), 'unRead': True, 'createdAt': datetime.now(),
                'content': f'A respondent has removed their response from {response["name"]}. '
                           f'You should download the updated test data again. https://golisten.ucd.ie/user'
                           f'/{get_task_url_by_collection(self.taskCollectionName)}/{response["testId"]}#responses'
            }
            # Use push operator to push a message
            self.db['users'].update_one({'_id': self.get_current_user()},
                                        {'$push': {'messages': {'$each': [message], '$sort': {'createdAt': -1}}}})
        self.dumps_write(result.raw_result)
