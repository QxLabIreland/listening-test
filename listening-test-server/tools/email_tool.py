import subprocess
from datetime import datetime
from uuid import uuid4
from pymongo.collection import Collection


def send_confirmation_email(col: Collection, email: str):
    # Generate a code
    confirmation_code = str(uuid4())
    col.update_one({'email': email}, {'$set': {
        'createdAt': datetime.now(), 'confirmationCode': confirmation_code
    }})
    # Send activation email with linux current user (If you don't have a MTA you can disable it)
    message = f"https://golisten.ucd.ie/confirm-email?{confirmation_code}\t" \
              f"The confirmation link will be invalid in 30 minutes"
    subject = "Please confirm your account"
    subprocess.run(f'echo "{message}" | mail -s "{subject}" {email}', shell=True)


def send_password_reset_email(confirmation: str, email: str):
    # Send email with linux current user
    message = f"https://golisten.ucd.ie/find-password?{confirmation}\t" \
              f"You are resetting the password and the link will be invalid in 30 minutes\t"
    subject = "Please reset your password"
    subprocess.run(f'echo "{message}" | mail -s "{subject}" {email}', shell=True)
