from handlers.test_handlers.acr_test import AcrTestHandler


class HearingTestHandler(AcrTestHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()
        self.taskCollectionName = 'hearingTests'
        self.surveyCollectionName = 'hearingSurveys'
