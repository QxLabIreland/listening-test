from typing import Optional

import tornado.web
from pymongo.collection import Collection

from handlers.base import BaseHandler


def switch_response_collection(self: BaseHandler, test_type: str) -> Optional[Collection]:
    """
    Get a response collection instance of MongoDB by test_type (test url)
    :param self: The handler instance that calls this method
    :param test_type: Test url such as ab-test
    :return: A response collection instance
    """
    # Get right test collection
    if test_type == 'ab-test':
        return self.db['abSurveys']
    elif test_type == 'acr-test':
        return self.db['acrSurveys']
    elif test_type == 'mushra-test':
        return self.db['mushraSurveys']
    elif test_type == 'hearing-test':
        return self.db['hearingSurveys']
    elif test_type == 'audio-labeling':
        return self.db['audioLabelingSurveys']
    elif test_type == 'image-labeling':
        return self.db['imageLabelingSurveys']
    elif test_type == 'image-ab':
        return self.db['imageAbSurveys']
    elif test_type == 'video-labeling':
        return self.db['videoLabelingSurveys']
    elif test_type == 'video-ab':
        return self.db['videoAbSurveys']
    else:
        self.set_error(400, 'Invalid task url')
        raise tornado.web.Finish


def switch_task_collection(self: BaseHandler, test_type: str) -> Optional[Collection]:
    """
    Get a task collection instance of MongoDB by test_type (test url)
    :param self: The handler instance that calls this method
    :param test_type: Test url such as ab-test
    :return: A task collection instance
    """
    if test_type == 'ab-test':
        return self.db['abTests']
    elif test_type == 'acr-test':
        return self.db['acrTests']
    elif test_type == 'mushra-test':
        return self.db['mushraTests']
    elif test_type == 'hearing-test':
        return self.db['hearingTests']
    elif test_type == 'audio-labeling':
        return self.db['audioLabelingTasks']
    elif test_type == 'image-labeling':
        return self.db['imageLabelingTasks']
    elif test_type == 'image-ab':
        return self.db['imageAbTasks']
    elif test_type == 'video-labeling':
        return self.db['videoLabelingTasks']
    elif test_type == 'video-ab':
        return self.db['videoAbTasks']
    else:
        self.set_error(400, 'Invalid task url')
        raise tornado.web.Finish


def get_task_url_by_collection(collection_name: str):
    """
    Get the task url string by collection name
    :param collection_name: The name of collection
    :return: Task url string
    """
    if collection_name == 'abTests':
        return 'ab-test'
    elif collection_name == 'acrTests':
        return 'acr-test'
    elif collection_name == 'mushraTests':
        return 'mushra-test'
    elif collection_name == 'hearingTests':
        return 'hearing-test'
    elif collection_name == 'audioLabelingTasks':
        return 'audio-labeling'
    elif collection_name == 'imageLabelingTasks':
        return 'image-labeling'
    elif collection_name == 'imageAbTasks':
        return 'image-ab'
    elif collection_name == 'videoLabelingTasks':
        return 'video-labeling'
    elif collection_name == 'videoAbTasks':
        return 'video-ab'
    else:
        raise tornado.web.Finish
