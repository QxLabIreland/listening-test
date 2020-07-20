from handlers.test_handlers.acr_test import AcrTestHandler


class HearingTestHandler(AcrTestHandler):
    def prepare(self):
        self.user_id = self.auth_current_user()
        self.test_name = 'hearing'

