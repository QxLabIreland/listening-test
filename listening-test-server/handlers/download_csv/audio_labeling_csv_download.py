from handlers.download_csv.acr_test_csv_download import AcrTestCsvDownload


class AudioLabelingCsvDownload(AcrTestCsvDownload):
    async def prepare(self):
        self.user_id = await self.auth_current_user()
        self.surveyCollectionName = 'audioLabelingSurveys'
