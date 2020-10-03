from handlers.download_csv.acr_test_csv_download import AcrTestCsvDownload


class AbTestResponsesDownload(AcrTestCsvDownload):
    """
    Uses none head_suffix for column and the value source is field.
    Normal ACR Test will use value source from medias array.
    """
    async def prepare(self):
        self.user_id = await self.auth_current_user()
        self.surveyCollectionName = 'abSurveys'

    async def get(self, head_suffix=None, value_source=None):
        await super(AbTestResponsesDownload, self).get('', 'fields')
