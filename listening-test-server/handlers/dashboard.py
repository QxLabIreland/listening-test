from handlers.base import BaseHandler


class DashboardHandler(BaseHandler):
    def prepare(self):
        self.auth_current_user()

    def get(self):
        pass
