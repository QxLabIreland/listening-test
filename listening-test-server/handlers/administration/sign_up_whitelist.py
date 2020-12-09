from typing import List

from pymongo.database import Database

from handlers.base import BaseHandler


class SingUpWhitelistHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()

    # To get all domains and emails
    async def get(self):
        whitelist = SignUpWhitelistTool(self.db)
        self.dumps_write({'domains': whitelist.domains, 'emails': whitelist.emails})

    # Add a domains or an email
    async def post(self):
        data = self.loads_body()
        result = self.db['signUpWhitelist'].insert_one(data)
        if 'domain' in data and data['domain'] or 'email' in data and data['email']:
            data['_id'] = result.inserted_id
            self.dumps_write(data)
        else:
            self.set_error(400, 'Input is invalid')

    # Delete one entry
    async def delete(self):
        data = self.loads_body()
        if 'domain' in data:
            result = self.db['signUpWhitelist'].delete_many({'domain': data['domain']})
            self.dumps_write(result.raw_result)
        elif 'email' in data:
            result = self.db['signUpWhitelist'].delete_many({'email': data['email']})
            self.dumps_write(result.raw_result)


class SignUpWhitelistTool(object):
    def __init__(self, db: Database):
        # Create domain list and email list
        self.domains: List[str] = []
        self.emails: List[str] = []
        data = db['signUpWhitelist'].find()
        for i in data:
            if 'domain' in i and i['domain']:
                self.domains.append(i['domain'])
            elif 'email' in i and i['email']:
                self.emails.append(i['email'])

    def validate(self, email: str) -> bool:
        # Check if the email is matched
        split_result = email.split('@')
        if len(split_result) != 2:
            raise Exception('Wrong email format')
        e_domain = split_result[1]
        return email in self.emails or e_domain in self.domains
