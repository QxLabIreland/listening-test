import pymongo
from bson import ObjectId
from handlers.base import BaseHandler
from datetime import datetime

from handlers.download_csv.acr_test_csv_download import build_tags, check_is_timed, build_header, build_row


class AbTestResponsesDownload(BaseHandler):
    def prepare(self):
        self.user_id = self.auth_current_user()

    # Download api
    async def get(self):
        # Get responses, based on 1 test
        test_id = self.get_argument('testId')
        data = self.db['abSurveys'].find({'userId': self.user_id, 'testId': ObjectId(test_id)})\
            .sort('createdAt', pymongo.DESCENDING)
        # If there is no data here
        if data.count() == 0:
            self.set_error(404, 'There is no enough AB Test responses')
            return

        # Build file name with test type and datetime
        csv_name = f"AB_Test-{datetime.now().strftime('%Y%m%d%H%M%S')}.csv"
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
                    t = build_header(x, '')
                    if t is not None:
                        header_list.append(t)
                        if check_is_timed(row):
                            header_list.append('Time (s)')
                self.write(','.join(header_list) + '\n')
                is_header_writen = True

            # Build three different lists of data
            value_list = [row['name'], row['createdAt'].strftime("%Y-%m-%d %H:%M:%S")]
            for x in row['items']:
                t = build_row(x, 'fields')
                if t is not None:
                    value_list.append(t)
                    if check_is_timed(row):
                        value_list.append(str(x['time']) if 'time' in x else '0')

            # Append these three list and write
            self.write(','.join(value_list) + '\n')
        await self.finish()
