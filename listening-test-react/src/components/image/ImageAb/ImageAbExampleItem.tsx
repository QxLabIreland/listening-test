import { observer } from 'mobx-react';
import React, { ReactNode } from 'react';

import { Button, CardContent, Collapse, Icon } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';

import { TagsGroup } from '../../../app/test-details/test-items/components/TagsGroup';
import { useMatStyles } from '../../../shared/SharedStyles';
import { SurveyControlType } from '../../../shared/enums/test-items';
import { ImageExampleModel } from '../../../shared/models/ImageTaskModel';
import { TestItemDropGridList } from '../../file-boxs/TestItemDropGridList';
import { RemovableSurveyControl } from '../../forms/RemovableSurveyControl';
import { ImageAbExampleSettings } from './ImageAbExampleSettings';

export const ImageAbExampleItem = observer(
  (
    props: React.PropsWithChildren<{
      example: ImageExampleModel;
      title: ReactNode;
      action: ReactNode;
      collapsed?: boolean;
      mediaType?: 'image' | 'video';
    }>,
  ) => {
    const { example, action, title, collapsed, mediaType = 'image' } = props;
    const classes = useMatStyles();
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
              <ImageAbExampleSettings
                settings={example.settings}
                onConfirm={newSettings => (example.settings = newSettings)}
              />
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
              <Grid item xs={12}>
                <TestItemDropGridList example={example} type={mediaType} disableUpload keepSlot />
              </Grid>
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
                <Grid item xs={12} className={classes.flexEnd}>
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
