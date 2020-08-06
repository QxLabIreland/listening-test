import os

import pymongo
import tornado.web
from bson import ObjectId

from handlers.base import BaseHandler
from handlers.miscellanea.test_responses import switch_response_collection
from tools.file_helper import write_data_in_csv
from datetime import datetime


class AbTestResponsesDownload(BaseHandler):
    def prepare(self):
        self.user_id = self.auth_current_user()

    # Download api
    async def get(self):
        # Change collection
        res_collection = self.db['abSurveys']
        if not res_collection:
            return
        # Get responses, based on 1 test
        test_id = self.get_argument('testId')
        data = res_collection.find({'userId': self.user_id, 'testId': ObjectId(test_id)})\
            .sort('createdAt', pymongo.DESCENDING)
        # If there is no data here
        if data.count() == 0:
            self.set_error(404, 'There is no enough AB test responses')
            return

        # Build file name with test type and datetime
        csv_name = f"AB_Test-{datetime.now().strftime('%Y%m%d%H%M%S')}.csv"
        # Set http response header for downloading file
        self.set_header('Content-Type', 'application/octet-stream')
        self.set_header('Content-Disposition', f'attachment; filename="{csv_name}"')

        # Set build csv and write
        is_header_writen = False
        for row in data:
            row['examples'] = [x['example'] for x in row['items']]
            if not is_header_writen:
                # Questions header
                header_list = ['Name', 'Date'] + [x['question'] for x in row['survey']]
                # Tags header: replace , for |. Add extra , for Comment field
                tag_list = [(x['tags'].replace(',', '|') if 'tags' in x else '') + ',' for x in row['examples']]
                # Tags label + blanks + tags for examples + next row
                self.write('Tags' + ',' * (len(header_list)) + ','.join(tag_list) + '\n')

                # Examples header: Example and Comment
                header_list = header_list + [f'Example{i + 1},Comment' for i in range(len(row['examples']))]
                self.write(','.join(header_list) + '\n')
                is_header_writen = True

            # Build three different lists of data
            base_list = [row['name'], row['createdAt'].strftime("%Y-%m-%d %H:%M:%S")]
            survey_value_list = [(x['value'] if x['value'] else '') if 'value' in x else '' for x in row['survey']]
            example_answer_list = []
            for x in row['examples']:
                # answer and comment become questions list
                if 'fields' in x:
                    ex_qu_dict = x['fields']
                    example_answer_list.append(ex_qu_dict[0]['value'] if len(ex_qu_dict) > 0 else '')
                    # Example tests have a comment field after answer
                    example_answer_list.append(ex_qu_dict[1]['value'] if len(ex_qu_dict) > 1 else '')
                else:
                    example_answer_list.append('')
                    example_answer_list.append('')

            # Append these three list and write
            self.write(','.join(base_list + survey_value_list + example_answer_list) + '\n')
        await self.finish()

        #
        # csv_columns = ['No', 'Name', 'Country']
        # dict_data = [
        #     {'No': 1, 'Name': 'Alex', 'Country': 'India'},
        #     {'No': 2, 'Name': 'Ben', 'Country': 'USA'},
        #     {'No': 3, 'Name': 'Shri Ram', 'Country': 'India'},
        #     {'No': 4, 'Name': 'Smith', 'Country': 'USA'},
        #     {'No': 5, 'Name': 'Yuva Raj', 'Country': 'India'},
        # ]
        # filename = write_data_in_csv(csv_columns, dict_data)
        # self.set_header('Content-Type', 'application/octet-stream')
        # self.set_header('Content-Disposition', f'attachment; filename="{os.path.basename(filename)}"')
        #
        # with open(filename, 'rb') as f:
        #     data = f.read()
        #     self.write(data)
        # await self.finish()

