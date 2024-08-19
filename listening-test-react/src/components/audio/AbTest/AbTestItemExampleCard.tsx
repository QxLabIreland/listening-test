import { observer } from 'mobx-react';
import React, { ReactNode } from 'react';

import { Button, CardContent, Collapse, Icon } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';

import { TagsGroup } from '../../../app/test-details/test-items/components/TagsGroup';
import { RemovableSurveyControl } from '../../../app/test-details/test-items/survery/RemovableSurveyControl';
import { SurveyControlType } from '../../../shared/enums/test-items';
import { AudioExampleModel } from '../../../shared/models/AudioTestModel';
import { AudioFileDropGrid } from '../../file-boxs/AudioFileDropGrid';
import { AudioExampleSettingsDialog } from '../AudioExampleSettingsDialog';

export const AbTestItemExampleCard = observer(
  (
    props: React.PropsWithChildren<{
      example: AudioExampleModel;
      title: ReactNode;
      action: ReactNode;
      collapsed?: boolean;
    }>,
  ) => {
    const { example, action, title, collapsed } = props;
    // Methods for audios changed
    const handleDeletedQuestionAdd = () =>
      example.fields.push({
        type: SurveyControlType.text,
        question: 'Briefly comment on your choice.',
        value: null,
        required: false,
      });

    return (
      <Card style={{ borderTop: '3px solid dodgerblue' }}>
        <CardHeader
          title={title}
          action={
            <>
              <AudioExampleSettingsDialog
                settings={example.settings}
                onConfirm={settings => (example.settings = settings)}
                disableRandomAudio
                enableAlwaysStartFrom0
              />
              {action}{' '}
            </>
          }
        />
        <Collapse in={!collapsed} timeout="auto" unmountOnExit>
          <CardContent style={{ paddingTop: 0 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TagsGroup value={example.tags} onChange={newTags => (example.tags = newTags)} />
              </Grid>
              <AudioFileDropGrid example={example} reference keepPlace />
              {/*Special survey questions for ab test*/}
              {example.fields?.map((q, qi) => (
                <Grid item xs={12} key={qi}>
                  <RemovableSurveyControl
                    question={q}
                    hideRemoveButton={qi < 1}
                    onRemove={() => example.fields.splice(qi, 1)}
                  />
                </Grid>
              ))}
              {/*An ability to delete one of special question*/}
              {example.fields?.length < 2 && (
                <Grid item xs={12} style={{ textAlign: 'right' }}>
                  <Button color="primary" onClick={handleDeletedQuestionAdd}>
                    <Icon>add</Icon> Add an additional question
                  </Button>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    );
  },
);
