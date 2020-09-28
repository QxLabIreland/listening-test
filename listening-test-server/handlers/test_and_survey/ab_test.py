from handlers.test_and_survey.acr_survey import AcrSurveyHandler
from handlers.test_and_survey.acr_test import AcrTestHandler


class AbTestHandler(AcrTestHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()
        self.taskCollectionName = 'abTests'
        self.surveyCollectionName = 'abSurveys'


class AbTestSurveyHandler(AcrSurveyHandler):
    def prepare(self):
        self.taskCollectionName = 'abTests'
        self.surveyCollectionName = 'abSurveys'
