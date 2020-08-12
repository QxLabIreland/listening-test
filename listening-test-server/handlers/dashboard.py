from handlers.base import BaseHandler


class DashboardHandler(BaseHandler):
    async def prepare(self):
        await self.auth_current_user()

    def get(self):
        pass
