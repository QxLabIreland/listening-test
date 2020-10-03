from handlers.test_and_survey.audio_acr_test import AcrTestHandler, AcrSurveyHandler


class ImageLabelingHandler(AcrTestHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()
        self.taskCollectionName = 'imageLabelingTasks'
        self.surveyCollectionName = 'imageLabelingSurveys'


class ImageLabelingSurveyHandler(AcrSurveyHandler):
    def prepare(self):
        self.taskCollectionName = 'imageLabelingTasks'
        self.surveyCollectionName = 'imageLabelingSurveys'
