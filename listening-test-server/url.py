from handlers.auth.find_password import FindPasswordHandler
from handlers.auth.users import UsersHandler
from handlers.dashboard import DashboardHandler
from handlers.download_csv.hearing_test_csv_download import HearingTestCsvDownload
from handlers.download_csv.mushra_test_csv_download import MushraTestCsvDownload
from handlers.miscellanea.storage_status import StorageStatusHandler
from handlers.survey.hearing_survey import HearingSurveyHandler
from handlers.survey.mushra_survey import MushraSurveyHandler
from handlers.test_handlers.acr_test import AcrTestHandler
from handlers.auth.sign_up_handler import SignUpHandler
from handlers.auth.login import LoginHandler
from handlers.auth.password import PasswordHandler
from handlers.test_handlers.ab_test import AbTestHandler
from handlers.download_csv.acr_test_csv_download import AcrTestCsvDownload
from handlers.survey.acr_survey import AcrSurveyHandler
from handlers.test_handlers.audio_labeling_task import AudioLabelingHandler
from handlers.test_handlers.hearing_test import HearingTestHandler
from handlers.test_handlers.mushra_test import MushraTestHandler
from handlers.miscellanea.responses_count import ResponsesCountHandler
from handlers.download_csv.ab_test_responses_download import AbTestResponsesDownload
from handlers.miscellanea.test_responses import TestResponsesHandler
from handlers.file_handler import FileHandler
from handlers.survey.ab_test_survey import AbTestSurveyHandler
from handlers.miscellanea.template_handler import TemplateHandler

path = [
    # Public
    ("/api/login", LoginHandler),
    ("/api/sign-up", SignUpHandler),

    # Tools, password and Web app management
    ("/api/audio-file", FileHandler),
    ("/api/password", PasswordHandler),
    ("/api/find-password", FindPasswordHandler),
    ("/api/dashboard", DashboardHandler),
    ("/api/users", UsersHandler),

    # Listening tests and Survey
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

    ("/api/audio-labeling", AudioLabelingHandler),
    # Image
    # Video
    # Response and Misc
    ("/api/response", TestResponsesHandler),
    ("/api/response-count", ResponsesCountHandler),
    ("/api/template", TemplateHandler),
    ("/api/storage", StorageStatusHandler),
]
