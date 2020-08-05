from typing import Optional

import tornado.web
from pymongo.collection import Collection

from handlers.base import BaseHandler


class ToggleTemplate(BaseHandler):
    def put(self):
        # Get collection and request data
        body = self.loads_body()
        collection = switch_test_collection(self)
        # Find the test and update
        data = collection.find_one({'_id': body['_id']})
        if 'isTemplate' not in data:
            data['isTemplate'] = True
        else:
            data['isTemplate'] = not data['isTemplate']
        collection.update_one({'_id': data['_id']}, {'$set': data})
        # Write result
        self.dumps_write(data['isTemplate'])


def switch_test_collection(self: BaseHandler) -> Optional[Collection]:
    test_type = self.loads_body()['testType']
    print(test_type)
    # Get right collection
    if test_type == 'ab-test':
        return self.db['abTests']
    elif test_type == 'acr-test':
        return self.db['acrTests']
    elif test_type == 'mushra-test':
        return self.db['mushraTests']
    elif test_type == 'hearing-test':
        return self.db['hearingTests']
    else:
        self.set_error(400, 'Invalid test url')
        raise tornado.web.Finish
