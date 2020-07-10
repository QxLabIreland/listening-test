import pymongo
from bson import ObjectId
from handlers.base import BaseHandler
from datetime import datetime


class AcrTestCsvDownload(BaseHandler):
    def prepare(self):
        self.user_id = self.auth_current_user()

    # Download api
    async def get(self):
        # Get responses, based on 1 test
        test_id = self.get_argument('testId')
        data = self.db['acrSurveys'].find({'userId': self.user_id, 'testId': ObjectId(test_id)})\
            .sort('createdAt', pymongo.DESCENDING)
        # If there is no data here
        if data.count() == 0:
            self.send_error(404, 'There is no enough ACR Test responses')
            return

        # Build file name with test type and datetime
        csv_name = f"ACR_Test-{datetime.now().strftime('%Y%m%d%H%M%S')}.csv"
        # Set http response header for downloading file
        self.set_header('Content-Type', 'application/octet-stream')
        self.set_header('Content-Disposition', f'attachment; filename="{csv_name}"')

        # Set build csv and write
        is_header_writen = False
        for row in data:
            if not is_header_writen:
                # Tags header: replace , for |. Add extra , for Comment field
                tag_list = [build_tags(x) for x in row['items'] if build_tags(x) is not None]
                # Tags label + blanks + tags for examples + next row
                self.write('Tags' + ',,' + ','.join(tag_list) + '\n')

                # Questions header. Examples header: Example and Comment
                header_list = ['Name', 'Date'] + [build_header(x) for x in row['items'] if build_header(x) is not None]
                self.write(','.join(header_list) + '\n')
                is_header_writen = True

            # Build three different lists of data
            base_list = [row['name'], row['createdAt'].strftime("%Y-%m-%d %H:%M:%S")]
            value_list = [build_row(x) for x in row['items'] if build_row(x) is not None]

            # Append these three list and write
            self.write(','.join(base_list + value_list) + '\n')
        await self.finish()


def build_tags(item):
    if item['type'] == 1:
        return ''
    if item['type'] == 2:  # Example
        if 'example' in item and 'tags' in item['example']:
            return (item['example']['tags'] or '').replace(',', '|')
        else:
            return ''
    else:
        return None


def build_header(item):
    if item['type'] == 1:  # Question
        if 'questionControl' in item and 'question' in item['questionControl']:
            return item['questionControl']['question'] or ''
        else:
            return ''
    elif item['type'] == 2:  # Example
        if 'example' in item:
            return 'rating'
        else:
            return ''
    else:  # 0: Section header, 3 Training
        return None


def build_row(item):
    if item['type'] == 1:  # Question
        if 'questionControl' in item and 'value' in item['questionControl']:
            # Checkbox has comma
            if item['questionControl']['type'] == 2:
                return '"' + (item['questionControl']['value'] or '') + '"'
            else:
                return item['questionControl']['value'] or ''
        else:
            return ''
    elif item['type'] == 2:  # Example
        if 'example' in item and 'audios' in item['example']:

            return '"' + ','.join([a['value'] if 'value' in a else '' for a in item['example']['audios']]) + '"'
        else:
            return ''
    else:  # 0: Section header, 3 Training
        return None
