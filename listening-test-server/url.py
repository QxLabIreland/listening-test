from handlers.acr_test import AcrTestHandler
from handlers.auth.sign_up_handler import SignUpHandler
from handlers.auth.login import LoginHandler
from handlers.auth.password import PasswordHandler
from handlers.ab_test import AbTestHandler
from handlers.download_csv.acr_test_csv_download import AcrTestCsvDownload
from handlers.survey.acr_survey import AcrSurveyHandler
from handlers.test_response.responses_count import ResponsesCountHandler
from handlers.download_csv.ab_test_responses_download import AbTestResponsesDownload
from handlers.test_response.test_responses import TestResponsesHandler
from handlers.audio_file import AudioFileHandler
from handlers.survey.ab_test_survey import AbTestSurveyHandler

api_url = r"/api"


path = [
    # Public
    ("/api/login", LoginHandler),
    ("/api/sign-up", SignUpHandler),

    # Tools and others
    ("/api/audio-file", AudioFileHandler),
    ("/api/password", PasswordHandler),

    # Tests
    ("/api/ab-test", AbTestHandler),
    ("/api/csv-download/abTest", AbTestResponsesDownload),
    ("/api/acr-test", AcrTestHandler),
    ("/api/csv-download/acrTest", AcrTestCsvDownload),

    # Response
    ("/api/response", TestResponsesHandler),
    ("/api/response-count", ResponsesCountHandler),

    # Survey and Task
    ("/api/task/ab-test", AbTestSurveyHandler),
    ("/api/task/acr-test", AcrSurveyHandler),
]

