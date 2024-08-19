import { observer } from 'mobx-react';
import React from 'react';

import { CardContent, Collapse, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';

import { AddQuestionButton } from '../../../app/test-details/add-buttons/AddQuestionButton';
import HeaderIconButtons from '../../../app/test-details/test-items/components/HeaderIconButtons';
import TitleInput from '../../../app/test-details/test-items/components/TitleInput';
import { SurveyControl } from '../../../app/test-details/test-items/survery/SurveyControl';
import { useMatStyles } from '../../../shared/SharedStyles';
import { AudioExampleSettingsModel, AudioFileModel } from '../../../shared/models/AudioTestModel';
import { BasicTaskItemModel } from '../../../shared/models/BasicTaskModel';
import { AudioFileDropGrid } from '../../file-boxs/AudioFileDropGrid';
import { FileUploadDropBox } from '../../file-boxs/FileUploadDropBox';
import { RemovableSurveyControl } from '../../forms/RemovableSurveyControl';
import { AudioExampleSettingsDialog } from '../AudioExampleSettingsDialog';

/** Training Test Item: Audios will play synchronously*/
export default observer(function AudioTestItemTraining({
  item,
}: React.PropsWithChildren<{
  item: BasicTaskItemModel;
}>) {
  const classes = useMatStyles();
  const { example, collapsed } = item;
  // Methods for audios changed
  const handleAdd = (newAudio: AudioFileModel) => example.medias.push(newAudio);
  // Setting submitted
  const handleSettingChange = (settings: AudioExampleSettingsModel) => (example.settings = settings);
  const addAdditionalQuestion = (item: BasicTaskItemModel) => example.fields.push(item.questionControl);
  const deleteAdditionalQuestion = () => example.fields.pop();

  return (
    <Card style={{ borderTop: '3px solid coral' }}>
      <CardHeader
        title={<TitleInput item={item} />}
        action={
          <>
            <AudioExampleSettingsDialog
              settings={example.settings}
              onConfirm={handleSettingChange}
              disableSectionLoop
              disableRandomAudio
            />
            <HeaderIconButtons item={item} />
          </>
        }
      />
      <Collapse in={!collapsed} timeout="auto" unmountOnExit>
        <CardContent style={{ paddingTop: 0 }}>
          <Grid container spacing={2}>
            {/*Description for this example*/}
            {example.fields && example.fields[0] && (
              <Grid item xs={12}>
                <SurveyControl control={example.fields[0]} />
              </Grid>
            )}
            <AudioFileDropGrid example={example} />
            {/*Placeholder for adding to list*/}
            <Grid item xs={12} md={4}>
              <FileUploadDropBox onChange={handleAdd} fileType="audio">
                <Typography>Drop or click to add a file</Typography>
                <Icon>attachment</Icon>
              </FileUploadDropBox>
            </Grid>
            {/*Additional question add*/}
            {example.fields && !(example.fields.length > 1) ? (
              <Grid item xs={12} className={classes.flexEnd}>
                <AddQuestionButton onAdd={addAdditionalQuestion} onlyCore />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <RemovableSurveyControl question={example.fields[1]} onRemove={deleteAdditionalQuestion} />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
});
