import csv
import os
from handlers.base import BaseHandler
from handlers.test_response.test_responses import switch_collection
from tools.file_helper import write_data_in_csv


class ResponsesDownloadHandler(BaseHandler):
    def prepare(self):
        self.user_id = self.get_current_user()

    # Download api
    async def get(self):
        collection = switch_collection(self)
        if not collection:
            return
        cursor = collection.find({'userId': self.user_id})
        if not cursor:
            return
        csv_columns = ['No', 'Name', 'Country']
        dict_data = [
            {'No': 1, 'Name': 'Alex', 'Country': 'India'},
            {'No': 2, 'Name': 'Ben', 'Country': 'USA'},
            {'No': 3, 'Name': 'Shri Ram', 'Country': 'India'},
            {'No': 4, 'Name': 'Smith', 'Country': 'USA'},
            {'No': 5, 'Name': 'Yuva Raj', 'Country': 'India'},
        ]
        filename = write_data_in_csv(csv_columns, dict_data)
        self.set_header('Content-Type', 'application/octet-stream')
        self.set_header('Content-Disposition', f'attachment; filename="{os.path.basename(filename)}"')

        with open(filename, 'rb') as f:
            data = f.read()
            self.write(data)

        await self.finish()
