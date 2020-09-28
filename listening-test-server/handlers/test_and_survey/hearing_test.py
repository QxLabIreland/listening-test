from handlers.test_and_survey.acr_survey import AcrSurveyHandler
from handlers.test_and_survey.acr_test import AcrTestHandler


class HearingTestHandler(AcrTestHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()
        self.taskCollectionName = 'hearingTests'
        self.surveyCollectionName = 'hearingSurveys'


class HearingSurveyHandler(AcrSurveyHandler):
    def prepare(self):
        self.taskCollectionName = 'hearingTests'
        self.surveyCollectionName = 'hearingSurveys'
