from tools.email_tool import send_confirmation_email
from handlers.base import BaseHandler


class DashboardHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user(check_activated=False)

    # Platform status
    async def get(self):
        stat = {
            # Admin is not registered user
            'userNumber': self.db['users'].count_documents({}),
            'testsNumber':
                self.db['abTests'].count_documents({})
                + self.db['acrTests'].count_documents({})
                + self.db['mushraTests'].count_documents({})
                + self.db['hearingTests'].count_documents({})
                + self.db['audioLabelingTasks'].count_documents({})
                + self.db['imageLabelingTasks'].count_documents({})
                + self.db['imageAbTasks'].count_documents({})
                + self.db['videoLabelingTasks'].count_documents({})
                + self.db['videoAbTasks'].count_documents({}),
            'responsesNumber':
                self.db['abSurveys'].count_documents({})
                + self.db['acrSurveys'].count_documents({})
                + self.db['mushraSurveys'].count_documents({})
                + self.db['hearingSurveys'].count_documents({})
                + self.db['audioLabelingSurveys'].count_documents({})
                + self.db['imageLabelingSurveys'].count_documents({})
                + self.db['imageAbSurveys'].count_documents({})
                + self.db['videoLabelingSurveys'].count_documents({})
                + self.db['videoAbSurveys'].count_documents({}),
        }
        self.dumps_write(stat)

    # Resend confirmation email for new user
    async def put(self):
        user = self.db['users'].find_one({'_id': self.user_id})
        send_confirmation_email(self.db['users'], user['email'])
