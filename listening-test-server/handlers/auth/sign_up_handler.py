from datetime import datetime, timedelta
from handlers.administration.sign_up_whitelist import SignUpWhitelistTool
from handlers.base import BaseHandler

from tools.email_tool import send_confirmation_email


class SignUpHandler(BaseHandler):
    # Register method
    async def post(self):
        body = self.loads_body()
        # Check if there is existing user
        user = self.db['users'].find_one({'email': body["email"]})
        if user:
            self.set_error(403, 'This email has been used.')
        # Check if email is in whitelist
        elif not SignUpWhitelistTool(self.db).validate(body["email"]):
            self.set_error(401, 'Your organisation needs to be set up on our system before you can create an account. '
                                'Please email golisten@ucd.ie with a brief outline of your project or organisation in '
                                'order to request an account.')
        else:
            del body['policy']
            # # To disable email confirmation, uncomment this line and comment email sending code
            # body['activated'] = True
            body['createdAt'] = datetime.now()
            user_oid = self.db['users'].insert(body)
            send_confirmation_email(self.db['users'], body['email'])
            # Return user id
            self.dumps_write(user_oid)

    # Go and confirm an email address
    async def get(self):
        activation_code = self.get_argument('confirmationCode')
        # Get confirmation code user
        user = self.db['users'].find_one({'confirmationCode': activation_code})
        # Check validation
        if user and datetime.now() - user['createdAt'] <= timedelta(minutes=30):
            # Update activated is true, and delete confirmation code
            result = self.db['users'].update_one({'_id': user['_id']}, {'$set': {
                'activated': True, 'confirmationCode': None
            }})
            self.dumps_write(result.raw_result)
        else:
            self.set_error(400, 'Invalid links')
