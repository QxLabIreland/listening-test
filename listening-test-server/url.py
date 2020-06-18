from handlers.pre_delete.homepage import Homepage
from handlers.pre_delete.something import SomethingHandler
from handlers.pre_delete.about import AboutHandler
from handlers.pre_delete.article import ArticleHandler
from handlers.pre_delete.comment import CommentHandler
from handlers.pre_delete.comment_managing import CommentManagingHandler
from handlers.pre_delete.category import CategoryHandler
from handlers.pre_delete.searching import SearchingHandler
from handlers.files_management.public_files import PublicFilesHandler


from handlers.auth.sign_up_handler import SignUpHandler
from handlers.auth.login import LoginHandler
from handlers.auth.password import PasswordHandler
from handlers.ab_test import AbTestHandler
from handlers.test_responses import TestResponsesHandler
from handlers.audio_file import AudioFileHandler
from handlers.survey.ab_test_survey import AbTestSurveyHandler

api_url = r"/api"


path = [
    # Public
    ("/api/login", LoginHandler),
    ("/api/sign-up", SignUpHandler),

    # Dashboard
    ("/api/ab-test", AbTestHandler),
    ("/api/response", TestResponsesHandler),
    ("/api/audio-file", AudioFileHandler),
    ("/api/password", PasswordHandler),

    # Survey and Task
    ("/api/task/ab-test", AbTestSurveyHandler),

    (api_url + r"/dashboard", Homepage),
    (api_url + r"/something", SomethingHandler),
    (api_url + r"/about", AboutHandler),
    (api_url + r"/article", ArticleHandler),
    (api_url + r"/comment", CommentHandler),
    (api_url + r"/comment_managing", CommentManagingHandler),
    (api_url + r"/category", CategoryHandler),
    (api_url + r"/searching", SearchingHandler),
    (api_url + r"/public_files", PublicFilesHandler),
]

