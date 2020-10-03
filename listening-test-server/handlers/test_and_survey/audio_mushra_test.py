from handlers.test_and_survey.audio_acr_test import AcrTestHandler, AcrSurveyHandler


class MushraTestHandler(AcrTestHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()
        self.taskCollectionName = 'mushraTests'
        self.surveyCollectionName = 'mushraSurveys'


class MushraSurveyHandler(AcrSurveyHandler):
    def prepare(self):
        self.taskCollectionName = 'mushraTests'
        self.surveyCollectionName = 'mushraSurveys'
