from tools.email_tool import send_confirmation_email
from handlers.base import BaseHandler


class DashboardHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user(check_activated=False)

    def get(self):
        pass

    def put(self):
        user = self.db['users'].find_one({'_id': self.user_id})
        send_confirmation_email(self.db['users'], user['email'])
