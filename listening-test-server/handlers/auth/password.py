from handlers.base import BaseHandler


class PasswordHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user(check_activated=False)

    # Modify the password for the user
    async def put(self):
        body = self.loads_body()
        user = self.db['users'].find_one({'_id': self.user_id})
        if user and user["password"] == body["password"]:
            # Update password here
            user['password'] = body["newPassword"]
            self.db['users'].update_one({'_id': self.user_id}, {'$set': user})
        else:
            self.set_error(400, reason="Current password is wrong or the user not found")

    # This is DELETE ACCOUNT
    async def delete(self):
        body = self.loads_body()
        user = self.db['users'].find_one({'_id': self.user_id})
        if user and user['password'] == body["password"]:
            # TODO change this to a loop for collection names
            # Delete user's records and survey
            self.db['abTests'].delete_many({'userId': self.user_id})
            self.db['abSurveys'].delete_many({'userId': self.user_id})
            # ACR
            self.db['acrTests'].delete_many({'userId': self.user_id})
            self.db['acrSurveys'].delete_many({'userId': self.user_id})
            # Mushra
            self.db['mushraTests'].delete_many({'userId': self.user_id})
            self.db['mushraSurveys'].delete_many({'userId': self.user_id})
            # Hearing
            self.db['hearingTests'].delete_many({'userId': self.user_id})
            self.db['hearingSurveys'].delete_many({'userId': self.user_id})
            # Delete the account
            self.db['users'].delete_one({'_id': self.user_id})
            self.write('done')
            # Clean the cookie
            self.clear_cookie("_user")
        else:
            self.set_error(400, 'user not found or the password is incorrect')
