import { observer } from 'mobx-react';
import React, { ReactNode } from 'react';

import { CardContent, Collapse, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';

import { TagsGroup } from '../../../app/test-details/test-items/components/TagsGroup';
import { SurveyControl } from '../../../app/test-details/test-items/survery/SurveyControl';
import { AudioExampleModel, AudioExampleSettingsModel, AudioFileModel } from '../../../shared/models/AudioTestModel';
import { AudioFileDropGrid } from '../../file-boxs/AudioFileDropGrid';
import { FileUploadDropBox } from '../../file-boxs/FileUploadDropBox';
import { AudioExampleSettingsDialog } from '../AudioExampleSettingsDialog';

export const MushraTestItemExampleCard = observer(
  (
    props: React.PropsWithChildren<{
      example: AudioExampleModel;
      title: ReactNode;
      action: ReactNode;
      collapsed?: boolean;
    }>,
  ) => {
    const { example, title, action, collapsed } = props;

    // Methods for audios changed
    const handleAdd = (newAudio: AudioFileModel) => example.medias.push(newAudio);
    // Setting submitted
    const handleSettingChange = (settings: AudioExampleSettingsModel) => (example.settings = settings);

    return (
      <Card style={{ borderTop: '3px solid dodgerblue' }}>
        <CardHeader
          title={title}
          action={
            <>
              <AudioExampleSettingsDialog settings={example.settings} onConfirm={handleSettingChange} />
              {action}
            </>
          }
        />
        <Collapse in={!collapsed} timeout="auto" unmountOnExit>
          <CardContent style={{ paddingTop: 0 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TagsGroup value={example.tags} onChange={newTags => (example.tags = newTags)} />
              </Grid>
              {/*Description for this example*/}
              {example.fields?.map((q, qi) => (
                <Grid item xs={12} key={qi}>
                  <SurveyControl control={q} />
                </Grid>
              ))}

              <AudioFileDropGrid example={example} reference />

              {/*Placeholder for adding to list*/}
              <Grid item xs={12} md={4}>
                <FileUploadDropBox onChange={handleAdd} fileType="audio">
                  <Typography>Drop or click to add a file</Typography>
                  <Icon>attachment</Icon>
                </FileUploadDropBox>
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
        {/*<CardActions style={{justifyContent: 'flex-end', paddingTop: 0}}>
    </CardActions>*/}
      </Card>
    );
  },
);
