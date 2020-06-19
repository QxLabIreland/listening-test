from datetime import datetime
from handlers.base import BaseHandler


class SignUpHandler(BaseHandler):
    async def post(self):
        body = self.loads_body()
        # Check if there is existing user
        user = self.db['users'].find_one({'email': body["email"]})
        if user:
            self.set_status(403, 'This email has been used')
        else:
            body['createdAt'] = datetime.now()
            # Do insertion into users
            user = self.db['users'].insert(body)
            self.dumps_write(user)
