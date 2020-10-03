from handlers.test_and_survey.audio_acr_test import AcrTestHandler, AcrSurveyHandler


class AudioLabelingHandler(AcrTestHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()
        self.taskCollectionName = 'audioLabelingTasks'
        self.surveyCollectionName = 'audioLabelingSurveys'


class AudioLabelingSurveyHandler(AcrSurveyHandler):
    def prepare(self):
        self.taskCollectionName = 'audioLabelingTasks'
        self.surveyCollectionName = 'audioLabelingSurveys'
