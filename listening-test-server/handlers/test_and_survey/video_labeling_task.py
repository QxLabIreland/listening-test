from handlers.test_and_survey.audio_acr_test import AcrTestHandler, AcrSurveyHandler


class VideoLabelingHandler(AcrTestHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()
        self.taskCollectionName = 'videoLabelingTasks'
        self.surveyCollectionName = 'videoLabelingSurveys'


class VideoLabelingSurveyHandler(AcrSurveyHandler):
    def prepare(self):
        self.taskCollectionName = 'videoLabelingTasks'
        self.surveyCollectionName = 'videoLabelingSurveys'
