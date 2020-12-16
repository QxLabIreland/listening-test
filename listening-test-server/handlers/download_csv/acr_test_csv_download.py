import json
from json import JSONDecodeError

import pymongo
from bson import ObjectId
from handlers.base import BaseHandler
from datetime import datetime


class AcrTestCsvDownload(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()
        self.surveyCollectionName = 'acrSurveys'

    # Download api
    async def get(self, head_suffix='rating', value_source='medias'):
        # Get responses, based on 1 test
        test_id = self.get_argument('testId')
        data = self.db[self.surveyCollectionName].find({'userId': self.user_id, 'testId': ObjectId(test_id)})\
            .sort('createdAt', pymongo.DESCENDING)
        # If there is no data here
        if data.count() == 0:
            self.set_error(404, 'There is no enough responses')
            return

        # Build file name with test type and datetime
        csv_name = f"{self.surveyCollectionName}-{datetime.now().strftime('%Y%m%d%H%M%S')}.csv"
        # Set http response header for downloading file
        self.set_header('Content-Type', 'application/octet-stream')
        self.set_header('Content-Disposition', f'attachment; filename="{csv_name}"')

        # Set build csv and write
        is_header_writen = False
        for row in data:
            if not is_header_writen:
                # Tags header: replace , for |. Add extra , for Comment field
                tag_list = []
                for x in row['items']:
                    t = build_tags(x)
                    if t is not None:
                        tag_list.append(t)
                        if check_is_timed(row):
                            tag_list.append('')
                # Tags label + blanks + tags for examples + next row
                self.write('Tags' + ',,' + ','.join(tag_list) + '\n')

                # Questions header. Examples header: Example and Comment
                header_list = ['Name', 'Date']
                for x in row['items']:
                    t = build_header(x, head_suffix)
                    if t is not None:
                        header_list.append(t)
                        if check_is_timed(row):
                            header_list.append('Time (s)')
                self.write(','.join(header_list) + '\n')
                is_header_writen = True

            # Build three different lists of data
            value_list = [row['name'], row['createdAt'].strftime("%Y-%m-%d %H:%M:%S")]
            for x in row['items']:
                t = build_row(x, value_source)
                if t is not None:
                    value_list.append(t)
                    if check_is_timed(row):
                        value_list.append(str(x['time']) if 'time' in x else '0')

            # Append these three list and write
            self.write(','.join(value_list) + '\n')
        await self.finish()


def build_tags(item):
    """
    Build the row of tags for a CSV file
    :param item: A test item, normally the first test item in responses of a test
    :return: CSV format string
    """
    if item['type'] == 1:  # Question
        return ''
    elif item['type'] == 2 or item['type'] == 3:  # Example or training also will get tags fields
        if 'example' in item and 'tags' in item['example']:
            return (item['example']['tags'] or '').replace(',', '|')
        else:
            return ''
    else:
        return None


def build_header(item, suffix='rating'):
    """
    Build the row of header for a CSV file
    :param item: A test item, normally the first test item in responses of a test
    :param suffix: This will be using in a test with rating bar
    :return: CSV format string including double quota
    """
    if item['type'] == 1:  # Question
        if 'questionControl' in item and 'question' in item['questionControl']:
            return f'"{item["questionControl"]["question"] or ""}"'
        else:
            return ''
    elif item['type'] == 2 or item['type'] == 3:  # Example with suffix or training
        if 'example' in item:
            return f'"{item["title"]} {suffix if item["type"] == 2 else ""}"'
        else:
            return ''
    else:  # 0: Section header, 3 Training
        return None


def build_row(item, value_source='medias'):
    """
    Build a row for a response, this may execute many times
    :param item: A test item
    :param value_source: Identify the source of values, from medias or fields
    :return: CSV format string including double quota
    """
    if item['type'] == 1:  # Question
        if 'questionControl' in item and 'value' in item['questionControl']:
            # Checkbox is json type, so we need to un stringify
            if 'type' in item['questionControl'] and item['questionControl']['type'] == 2:
                try:
                    value = json.loads(item["questionControl"]["value"])
                    return f'"{",".join(value)}"'
                # To be compatible with old version of checkbox value
                except Exception as e:
                    print(e)
                    pass
            return f'"{item["questionControl"]["value"] or ""}"'
        else:
            return ''
    elif item['type'] == 2:  # Example
        if 'example' in item and value_source in item['example']:
            row_values = []
            for a in item['example'][value_source]:
                # Ignore description question type
                if 'type' in a and a['type'] == 3:
                    continue
                row_values.append((a['value'] or '') if 'value' in a else '')
            return f'"{",".join(row_values)}"'
        else:
            return ''
    elif item['type'] == 3:  # Training with only one 'ask a question'
        if 'example' in item and 'fields' in item['example'] \
                and len(item['example']['fields']) > 1 and 'value' in item['example']['fields'][1]:
            return f'"{item["example"]["fields"][1]["value"] or ""}"'
        else:
            return ''
    else:  # 0: Section header
        return None


# Check if the test should be timed
def check_is_timed(row):
    return 'settings' in row and 'isTimed' in row['settings'] and row['settings']['isTimed']
