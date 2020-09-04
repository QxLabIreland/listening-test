import subprocess
from datetime import datetime, timedelta
from uuid import uuid4

from handlers.base import BaseHandler
from tools.email_tool import send_password_reset_email


class FindPasswordHandler(BaseHandler):
    # Generate new confirmation code and send email
    async def put(self):
        body = self.loads_body()
        confirmation = str(uuid4())
        result = self.db['users'].update_one({'email': body['email']}, {'$set': {
            'confirmationCode': confirmation, 'passwordResetAt': datetime.now()
        }})
        if result.modified_count > 0:
            send_password_reset_email(confirmation, body['email'])

    # Reset password
    async def post(self):
        # Get data form client
        body = self.loads_body()
        user = self.db['users'].find_one({'confirmationCode': body['confirmationCode']})
        # Get difference to make sure password valid
        if user and datetime.now() - user['passwordResetAt'] <= timedelta(minutes=30):
            self.db['users'].update_one({'_id': user['_id']}, {'$set': {
                'password': body['password'], 'confirmationCode': None
            }})
        else:
            self.set_error(403, 'Invalid links')
