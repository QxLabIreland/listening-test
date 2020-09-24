from datetime import datetime

import pymongo
from bson import ObjectId

from handlers.base import BaseHandler
from handlers.download_csv.acr_test_csv_download import build_tags, check_is_timed, build_header


class MushraTestCsvDownload(BaseHandler):
    async def prepare(self):
        self.user_id = await self.auth_current_user()

    async def get(self):
        # Get responses, based on 1 test
        test_id = self.get_argument('testId')
        data = self.db['mushraSurveys'].find({'userId': self.user_id, 'testId': ObjectId(test_id)})\
            .sort('createdAt', pymongo.DESCENDING)
        # If there is no data here
        if data.count() == 0:
            self.set_error(404, 'There is no enough Mushra Test responses')
            return

        # Build file name with test type and datetime
        csv_name = f"mushra_Test-{datetime.now().strftime('%Y%m%d%H%M%S')}.csv"
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
                        # Give medias spaces
                        if x['type'] == 2:  # Example
                            if 'example' in x and 'medias' in x['example']:
                                tag_list += [''] * (len(x['example']['medias']) - 1)
                        # Check if it is timed
                        if check_is_timed(row):
                            tag_list.append('')
                # Tags label + blanks + tags for examples + next row
                self.write('Tags' + ',,' + ','.join(tag_list) + '\n')

                # Questions header. Examples header: Example and Comment
                header_list = ['Name', 'Date']
                # Additional row for medias' names
                audio_names = ['', '']
                for x in row['items']:
                    t = build_header(x)
                    if t is not None:
                        header_list.append(t)
                        # Give medias spaces
                        if x['type'] == 2:  # Example
                            if 'example' in x and 'medias' in x['example']:
                                header_list += [''] * (len(x['example']['medias']) - 1)
                                audio_names += [a['filename'] for a in x['example']['medias']]
                        else:
                            audio_names.append('')
                        # Check if it is timed
                        if check_is_timed(row):
                            header_list.append('Time (s)')
                            audio_names.append('')
                self.write(','.join(header_list) + '\n')
                self.write(','.join(audio_names) + '\n')
                is_header_writen = True

            # Build three different lists of data
            value_list = [row['name'], row['createdAt'].strftime("%Y-%m-%d %H:%M:%S")]
            for x in row['items']:
                t = build_mushra_row(x)
                if t is not None:
                    value_list.append(t)
                    if check_is_timed(row):
                        value_list.append(str(x['time']) if 'time' in x else '0')

            # Append these three list and write
            self.write(','.join(value_list) + '\n')
        await self.finish()


def build_mushra_row(item):
    if item['type'] == 1:  # Question
        if 'questionControl' in item and 'value' in item['questionControl']:
            # Checkbox has comma, so we need "
            if item['questionControl']['type'] == 2:
                return '"' + (item['questionControl']['value'] or '') + '"'
            else:
                return item['questionControl']['value'] or ''

    elif item['type'] == 2:  # Example
        if 'example' in item and 'medias' in item['example']:
            row_values = [(a['value'] or '') if 'value' in a else '' for a in item['example']['medias']]
            return ','.join(row_values)

    return ''
