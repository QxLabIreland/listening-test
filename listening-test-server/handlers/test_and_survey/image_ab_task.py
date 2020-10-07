from handlers.test_and_survey.audio_acr_test import AcrTestHandler, AcrSurveyHandler


class ImageAbHandler(AcrTestHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()
        self.taskCollectionName = 'imageAbTasks'
        self.surveyCollectionName = 'imageAbSurveys'


class ImageAbSurveyHandler(AcrSurveyHandler):
    def prepare(self):
        self.taskCollectionName = 'imageAbTasks'
        self.surveyCollectionName = 'imageAbSurveys'
