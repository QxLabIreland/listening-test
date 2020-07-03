from handlers.acr_test import AcrTestHandler
from handlers.auth.sign_up_handler import SignUpHandler
from handlers.auth.login import LoginHandler
from handlers.auth.password import PasswordHandler
from handlers.ab_test import AbTestHandler
from handlers.test_response.responses_count import ResponsesCountHandler
from handlers.test_response.responses_download import ResponsesDownloadHandler
from handlers.test_response.test_responses import TestResponsesHandler
from handlers.audio_file import AudioFileHandler
from handlers.survey.ab_test_survey import AbTestSurveyHandler

api_url = r"/api"


path = [
    # Public
    ("/api/login", LoginHandler),
    ("/api/sign-up", SignUpHandler),

    # Dashboard
    ("/api/ab-test", AbTestHandler),
    ("/api/acr-test", AcrTestHandler),
    ("/api/audio-file", AudioFileHandler),
    ("/api/password", PasswordHandler),

    # Response
    ("/api/response", TestResponsesHandler),
    ("/api/response-download", ResponsesDownloadHandler),
    ("/api/response-count", ResponsesCountHandler),

    # Survey and Task
    ("/api/task/ab-test", AbTestSurveyHandler),
]

