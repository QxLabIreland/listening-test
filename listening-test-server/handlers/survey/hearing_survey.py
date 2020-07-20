from handlers.survey.acr_survey import AcrSurveyHandler


class HearingSurveyHandler(AcrSurveyHandler):
    def prepare(self):
        self.test_name = 'hearing'
