from handlers.base import BaseHandler
from tools.constants import permission_list


class UsersHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user('User')

    async def get(self):
        # Exclude current user and administrators
        # data = self.db['users'].find({'isAdmin': {'$ne': True}, '_id': {'$nin': [self.user_id]}}, {'password': 0})
        data = self.db['users'].find({'isAdmin': {'$ne': True}}, {'password': 0})
        self.dumps_write(data)

    async def post(self):
        body = self.loads_body()
        # Find the user needs to be updated
        user = self.db['users'].find_one({'_id': body['_id']})
        new_permission = body['newPermission']
        # Create permission list
        if 'permissions' not in user or not user['permissions']:
            user['permissions'] = []
        # Permission validation and update appended new permission
        if new_permission not in permission_list:
            self.set_error(400, "Permission doesn't exist")
        # Check duplicate

        if new_permission in user['permissions']:
            user['permissions'].remove(new_permission)
        else:
            user['permissions'].append(new_permission)

        self.db['users'].update({'_id': user['_id']}, {'$set': user})
        self.dumps_write(user['permissions'])


