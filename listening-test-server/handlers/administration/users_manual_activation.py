from bson import ObjectId

from handlers.base import BaseHandler


class UsersManualActivationHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user('User')

    # Manually activate the selected user
    async def patch(self, user_id):
        if user_id == str(self.user_id):
            self.set_error(403, "You can't deactivate you self")
        user = self.db['users'].find_one({'_id': ObjectId(user_id)})
        result = self.db['users'].update_one({'_id': ObjectId(user_id)}, {'$set': {
            'activated': not user.get('activated'), 'confirmationCode': None
        }})
        self.dumps_write(result.raw_result)
