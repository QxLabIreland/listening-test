from handlers.base import BaseHandler
from handlers.miscellanea.task_name_mapping import switch_task_collection


class TemplateHandler(BaseHandler):
    async def get(self):
        test_type = self.get_argument('testType')
        collection = switch_task_collection(self, test_type)
        data = collection.aggregate([
            {'$match': {'isTemplate': True}},
            {'$lookup': {'from': 'users', 'localField': 'userId', 'foreignField': '_id', 'as': 'creator'}},
            {'$set': {'creator': {'$arrayElemAt': ['$creator', 0]}}},
            {'$project': {'items': 0, 'description': 0, 'settings': 0, 'creator.permissions': 0,
                          'creator.password': 0, 'creator.policy': 0, 'creator.createdAt': 0}},
            {'$sort': {'createdAt': -1}}
        ])
        self.dumps_write(data)

    async def put(self):
        # Get user and check the permissions
        self.user_id = await self.auth_current_user('Template')
        test_type = self.get_argument('testType')

        # Get collection and request data
        body = self.loads_body()
        collection = switch_task_collection(self, test_type)
        # Find the test and update
        data = collection.find_one({'_id': body['_id']})
        if 'isTemplate' not in data:
            data['isTemplate'] = True
        else:
            data['isTemplate'] = not data['isTemplate']
        collection.update_one({'_id': data['_id']}, {'$set': data})
        # Write result
        self.dumps_write(data['isTemplate'])


