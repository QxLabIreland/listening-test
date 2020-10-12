from handlers.test_and_survey.audio_acr_test import AcrTestHandler, AcrSurveyHandler


class VideoAbHandler(AcrTestHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()
        self.taskCollectionName = 'videoAbTasks'
        self.surveyCollectionName = 'videoAbSurveys'


class VideoAbSurveyHandler(AcrSurveyHandler):
    def prepare(self):
        self.taskCollectionName = 'videoAbTasks'
        self.surveyCollectionName = 'videoAbSurveys'
