from tools.email_tool import send_confirmation_email
from handlers.base import BaseHandler


class DashboardHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user(check_activated=False)

    # Platform status
    async def get(self):
        stat = {
            # Admin is not registered user
            'userNumber': self.db['users'].find().count(),
            'responsesNumber':
                self.db['abTests'].find().count()
                + self.db['acrTests'].find().count()
                + self.db['mushraTests'].find().count()
                + self.db['hearingTests'].find().count()
                + self.db['audioLabelingTasks'].find().count()
                + self.db['imageLabelingTasks'].find().count()
                + self.db['imageAbTasks'].find().count()
                + self.db['videoLabelingTasks'].find().count()
                + self.db['videoAbTasks'].find().count(),
            'testsNumber':
                self.db['abSurveys'].find().count()
                + self.db['acrSurveys'].find().count()
                + self.db['mushraSurveys'].find().count()
                + self.db['hearingSurveys'].find().count()
                + self.db['audioLabelingSurveys'].find().count()
                + self.db['imageLabelingSurveys'].find().count()
                + self.db['imageAbSurveys'].find().count()
                + self.db['videoLabelingSurveys'].find().count()
                + self.db['videoAbSurveys'].find().count(),
        }
        self.dumps_write(stat)

    # Resend confirmation email for new user
    async def put(self):
        user = self.db['users'].find_one({'_id': self.user_id})
        send_confirmation_email(self.db['users'], user['email'])
