from handlers.test_handlers.acr_test import AcrTestHandler


class AudioLabelingHandler(AcrTestHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()
        self.taskCollectionName = 'audioLabelingTasks'
        self.surveyCollectionName = 'audioLabelingSurveys'
