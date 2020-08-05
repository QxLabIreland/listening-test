from handlers.auth.users import UsersHandler
from handlers.dashboard import DashboardHandler
from handlers.download_csv.hearing_test_csv_download import HearingTestCsvDownload
from handlers.download_csv.mushra_test_csv_download import MushraTestCsvDownload
from handlers.survey.hearing_survey import HearingSurveyHandler
from handlers.survey.mushra_survey import MushraSurveyHandler
from handlers.test_handlers.acr_test import AcrTestHandler
from handlers.auth.sign_up_handler import SignUpHandler
from handlers.auth.login import LoginHandler
from handlers.auth.password import PasswordHandler
from handlers.test_handlers.ab_test import AbTestHandler
from handlers.download_csv.acr_test_csv_download import AcrTestCsvDownload
from handlers.survey.acr_survey import AcrSurveyHandler
from handlers.test_handlers.hearing_test import HearingTestHandler
from handlers.test_handlers.mushra_test import MushraTestHandler
from handlers.test_response.responses_count import ResponsesCountHandler
from handlers.download_csv.ab_test_responses_download import AbTestResponsesDownload
from handlers.test_response.test_responses import TestResponsesHandler
from handlers.audio_file import AudioFileHandler
from handlers.survey.ab_test_survey import AbTestSurveyHandler
from handlers.test_response.toggle_template import ToggleTemplate

path = [
    # Public
    ("/api/login", LoginHandler),
    ("/api/sign-up", SignUpHandler),

    # Tools and others
    ("/api/audio-file", AudioFileHandler),
    ("/api/password", PasswordHandler),

    # Web app management
    ("/api/dashboard", DashboardHandler),
    ("/api/users", UsersHandler),

    # # Tests and Survey
    ("/api/ab-test", AbTestHandler),
    ("/api/csv-download/ab-test", AbTestResponsesDownload),
    ("/api/task/ab-test", AbTestSurveyHandler),

    ("/api/acr-test", AcrTestHandler),
    ("/api/csv-download/acr-test", AcrTestCsvDownload),
    ("/api/task/acr-test", AcrSurveyHandler),

    ("/api/mushra-test", MushraTestHandler),
    ("/api/csv-download/mushra-test", MushraTestCsvDownload),
    ("/api/task/mushra-test", MushraSurveyHandler),

    ("/api/hearing-test", HearingTestHandler),
    ("/api/csv-download/hearing-test", HearingTestCsvDownload),
    ("/api/task/hearing-test", HearingSurveyHandler),

    # Response and Misc
    ("/api/response", TestResponsesHandler),
    ("/api/response-count", ResponsesCountHandler),
    ("/api/toggle-template", ToggleTemplate),
]

