from handlers.basic_test_handler import BasicTestHandler


class AcrTestHandler(BasicTestHandler):
    def prepare(self):
        self.user_id = self.auth_current_user()
        self.current_db = self.db['acrTests']
