from handlers.auth.find_password import FindPasswordHandler
from handlers.auth.users import UsersHandler
from handlers.dashboard import DashboardHandler
from handlers.download_csv.audio_labeling_csv_download import AudioLabelingCsvDownload
from handlers.download_csv.hearing_test_csv_download import HearingTestCsvDownload
from handlers.download_csv.image_ab_csv_download import ImageAbCsvDownload
from handlers.download_csv.image_labeling_csv_download import ImageLabelingCsvDownload
from handlers.download_csv.mushra_test_csv_download import MushraTestCsvDownload
from handlers.download_csv.video_labeling_csv_download import VideoLabelingCsvDownload
from handlers.miscellanea.storage_status import StorageStatusHandler
from handlers.test_and_survey.audio_acr_test import AcrTestHandler, AcrSurveyHandler
from handlers.auth.sign_up_handler import SignUpHandler
from handlers.auth.login import LoginHandler
from handlers.auth.password import PasswordHandler
from handlers.test_and_survey.audio_ab_test import AbTestHandler, AbTestSurveyHandler
from handlers.download_csv.acr_test_csv_download import AcrTestCsvDownload
from handlers.test_and_survey.audio_labeling_task import AudioLabelingHandler, AudioLabelingSurveyHandler
from handlers.test_and_survey.hearing_test import HearingTestHandler, HearingSurveyHandler
from handlers.test_and_survey.image_ab_task import ImageAbHandler, ImageAbSurveyHandler
from handlers.test_and_survey.image_labeling_task import ImageLabelingHandler, ImageLabelingSurveyHandler
from handlers.test_and_survey.audio_mushra_test import MushraTestHandler, MushraSurveyHandler
from handlers.miscellanea.responses_count import ResponsesCountHandler
from handlers.download_csv.ab_test_responses_download import AbTestResponsesDownload
from handlers.miscellanea.test_responses import TestResponsesHandler
from handlers.file_handler import FileHandler
from handlers.miscellanea.template_handler import TemplateHandler
from handlers.test_and_survey.video_labeling_task import VideoLabelingHandler, VideoLabelingSurveyHandler

path = [
    # Public
    ("/api/login", LoginHandler),
    ("/api/sign-up", SignUpHandler),

    # Tools, password and Web app management
    ("/api/upload-file", FileHandler),
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
    ("/api/task/audio-labeling", AudioLabelingSurveyHandler),
    ("/api/csv-download/audio-labeling", AudioLabelingCsvDownload),
    # Image
    ("/api/image-labeling", ImageLabelingHandler),
    ("/api/task/image-labeling", ImageLabelingSurveyHandler),
    ("/api/csv-download/image-labeling", ImageLabelingCsvDownload),

    ("/api/image-ab", ImageAbHandler),
    ("/api/task/image-ab", ImageAbSurveyHandler),
    ("/api/csv-download/image-ab", ImageAbCsvDownload),
    # Video
    ("/api/video-labeling", VideoLabelingHandler),
    ("/api/task/video-labeling", VideoLabelingSurveyHandler),
    ("/api/csv-download/video-labeling", VideoLabelingCsvDownload),
    # Response and Misc
    ("/api/response", TestResponsesHandler),
    ("/api/response-count", ResponsesCountHandler),
    ("/api/template", TemplateHandler),
    ("/api/storage", StorageStatusHandler),
]
