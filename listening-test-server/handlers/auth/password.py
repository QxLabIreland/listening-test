from handlers.base import BaseHandler


class PasswordHandler(BaseHandler):

    def prepare(self):
        self.user_id = self.get_current_user()

    async def put(self):
        body = self.loads_body()
        user = self.db['users'].find_one({'_id': self.user_id})
        if user and user["password"] == body["password"]:
            # Update password here
            user['password'] = body["newPassword"]
            self.db['users'].update_one({'_id': self.user_id}, {'$set': user})
        else:
            self.send_error(400, reason="Current password is wrong or the user not found")
