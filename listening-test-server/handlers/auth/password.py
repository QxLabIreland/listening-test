from handlers.base import BaseHandler


class PasswordHandler(BaseHandler):

    def prepare(self):
        self.user_id = self.get_current_user()

    async def put(self):
        body = self.loads_body()
        user = self.db['users'].find_one({'_id': self.user_id})
        if user and user["password"] == body["oldPassword"]:
            user['password'] = body["oldPassword"]
            self.db['users'].update_one({'_id': self.user_id}, user)
        else:
            self.send_error(400, reason="The user cannot be found or password is wrong")
