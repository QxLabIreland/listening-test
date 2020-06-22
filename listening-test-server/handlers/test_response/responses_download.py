import os

from bson import ObjectId

from handlers.base import BaseHandler
from handlers.test_response.test_responses import switch_collection
from tools.file_helper import write_data_in_csv
from datetime import datetime


class ResponsesDownloadHandler(BaseHandler):
    def prepare(self):
        self.user_id = self.get_current_user()

    # Download api
    async def get(self):
        collection = switch_collection(self)
        if not collection:
            return
        test_id = self.get_argument('testId')
        data = collection.find({'userId': self.user_id, 'testId': ObjectId(test_id)})
        if not data:
            return

        # Build file name with test type and datetime
        csv_name = f"{self.get_argument('testType')}-{datetime.now().strftime('%Y%m%d%H%M%S')}.csv"
        # Set http response header for downloading file
        self.set_header('Content-Type', 'application/octet-stream')
        self.set_header('Content-Disposition', f'attachment; filename="{csv_name}"')

        # Set the header of base info
        is_header_writen = False
        self.write('Name,Date,')
        for row in data:
            if not is_header_writen:
                # Questions header
                header_list = [x['question'] for x in row['survey']]
                self.write(','.join(header_list) + ',')

                # Examples header
                header_list = ['Example' + str(i + 1) for i in range(len(row['examples']))]
                self.write(','.join(header_list) + '\n')
                is_header_writen = True

            # Build three different lists of data
            base_list = [row['name'], row['createdAt'].strftime("%Y-%m-%d %H:%M:%S")]
            survey_value_list = [x['value'] for x in row['survey'] if 'value' in x]
            example_answer_list = [x['answer'] for x in row['examples'] if 'answer' in x]

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

