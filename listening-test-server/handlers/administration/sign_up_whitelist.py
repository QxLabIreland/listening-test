from typing import List

from pymongo.database import Database

from handlers.base import BaseHandler


class SingUpWhitelistHandler(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()

    # To get all domains and emails
    async def get(self):
        whitelist = SignUpWhitelistTool(self.db)
        str_domains = ['.'.join(d) for d in whitelist.domains]
        self.dumps_write({'domains': str_domains, 'emails': whitelist.emails})

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
        self.domains: List[List[str]] = []
        self.emails: List[str] = []
        data = db['signUpWhitelist'].find()
        for i in data:
            if 'domain' in i and i['domain']:
                # Split domain into array and compare elements of array
                self.domains.append(i['domain'].split('.'))
            elif 'email' in i and i['email']:
                self.emails.append(i['email'])

    def validate(self, email: str) -> bool:
        if email in self.emails:
            return True
        # Check if the email is matched
        split_result = email.split('@')
        if len(split_result) != 2:
            raise Exception('Wrong email format')
        input_domain = split_result[1].split('.')

        for domain in self.domains:
            if len(domain) == len(input_domain):
                is_match = True
                # Find a string which doesn't match
                for i, v in enumerate(domain):
                    # Skip wildcards
                    if v != '*' and v != input_domain[i]:
                        is_match = False
                        break
                # If each part of domain match
                if is_match:
                    return True
        return False
