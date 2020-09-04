import subprocess
from datetime import datetime
from email.mime.text import MIMEText
from smtplib import SMTP_SSL
from uuid import uuid4
from pymongo.collection import Collection


def send_confirmation_email(col: Collection, email: str):
    # Generate a code
    confirmation_code = str(uuid4())
    col.update_one({'email': email}, {'$set': {
        'createdAt': datetime.now(), 'confirmationCode': confirmation_code
    }})
    # Send activation email with linux current user (If you don't have a MTA you can disable it)
    message = f"https://golisten.ucd.ie/confirm-email?{confirmation_code}\r\n" \
              f"Click the link to confirm your email address and it will be invalid in 30 minutes"
    subject = "Please confirm your account"
    sender = 'noreply@golisten.ucd.ie'
    subprocess.run(f'echo "Content-Type: text/plain\r\nFrom: {sender}\r\nTo: {email}\r\n'
                   f'Subject: {subject}\r\n\r\n{message}" | sendmail -f {sender} {email}', shell=True)


def send_password_reset_email(confirmation: str, email: str):
    # Send email with linux current user
    message = f"https://golisten.ucd.ie/find-password?{confirmation}\r\n" \
              f"You are resetting the password and the link will be invalid in 30 minutes"
    subject = "Please check your reset password link"
    sender = 'noreply@golisten.ucd.ie'
    subprocess.run(f'echo "Content-Type: text/plain\r\nFrom: {sender}\r\nTo: {email}\r\n'
                   f'Subject: {subject}\r\n\r\n{message}" | sendmail -f {sender} {email}', shell=True)


def send_password_reset_email2(confirmation: str, target_email: str):
    # Create an email content
    msg = MIMEText(f"https://golisten.ucd.ie/find-password?{confirmation}\r\n"
                   f"You are resetting the password and the link will be invalid in 30 minutes\r\n")
    msg['Subject'] = 'Please reset your password'
    msg['From'] = 'noreply@golisten.ucd.ie'
    msg['To'] = target_email
    # Connect to localhost email server
    conn = SMTP_SSL('localhost')
    try:
        # Login and send email
        conn.sendmail('noreply@golisten.ucd.ie', target_email, msg.as_string())
    finally:
        conn.quit()
    # subprocess.run(f'echo "{message}" | mail -s "{subject}" {email}', shell=True)
