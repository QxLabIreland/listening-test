from handlers.survey.acr_survey import AcrSurveyHandler


class AbTestSurveyHandler(AcrSurveyHandler):
    def prepare(self):
        self.test_name = 'ab'
