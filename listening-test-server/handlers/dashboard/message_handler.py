from handlers.base import BaseHandler


class MessageHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()

    # Get all messages for the user
    async def get(self):
        user = self.db['users'].find_one({'_id': self.user_id}, {'messages': 1})
        self.dumps_write(user)

    # Set all messages have been read
    async def patch(self):
        result = self.db['users'].update_many(
            {'_id': self.user_id, 'messages.unRead': True}, {'$set': {'messages.$.unRead': False}}
        )
        self.dumps_write(result.raw_result)
