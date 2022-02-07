import { observer } from 'mobx-react';
import React, { ReactNode } from 'react';

import { Button, CardContent, Collapse, Icon } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';

import { AudioExampleModel } from '../../../shared/models/AudioTestModel';
import { SurveyControlType } from '../../../shared/models/EnumsAndTypes';
import { RemovableSurveyControl } from '../../forms/RemovableSurveyControl';
import { TagsGroup } from '../../forms/TagsGroup';
import { AudioExampleSettingsDialog } from '../AudioExampleSettingsDialog';
import { AudioFileDropGrid } from '../AudioFileDropGrid';

export const AbTestItemExampleCard = observer(
  (
    props: React.PropsWithChildren<{
      example: AudioExampleModel;
      title: ReactNode;
      action: ReactNode;
      collapsed?: boolean;
    }>
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
                onConfirm={(settings) => (example.settings = settings)}
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
                <TagsGroup value={example.tags} onChange={(newTags) => (example.tags = newTags)} />
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
  }
);
