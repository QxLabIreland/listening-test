from handlers.download_csv.acr_test_csv_download import AcrTestCsvDownload


class MushraTestCsvDownload(AcrTestCsvDownload):
    def prepare(self):
        self.user_id = self.auth_current_user()
        self.test_name = 'mushra'
