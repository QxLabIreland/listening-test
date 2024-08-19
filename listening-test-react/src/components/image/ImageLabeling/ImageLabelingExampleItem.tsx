import { observer } from 'mobx-react';
import React, { ReactNode } from 'react';

import { CardContent, Collapse } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';

import { AddQuestionButton } from '../../../app/test-details/add-buttons/AddQuestionButton';
import { TagsGroup } from '../../../app/test-details/test-items/components/TagsGroup';
import { RemovableSurveyControl } from '../../../app/test-details/test-items/survery/RemovableSurveyControl';
import { SurveyControl } from '../../../app/test-details/test-items/survery/SurveyControl';
import { useMatStyles } from '../../../shared/SharedStyles';
import { ImageExampleModel, ImageTestItemModel } from '../../../shared/models/ImageTaskModel';
import { TestItemDropGridList } from '../../file-boxs/TestItemDropGridList';

export const ImageLabelingExampleItem = observer(
  (
    props: React.PropsWithChildren<{
      example: ImageExampleModel;
      title: ReactNode;
      action: ReactNode;
      collapsed?: boolean;
      type?: 'video' | 'image';
    }>,
  ) => {
    const { example, title, action, collapsed, type = 'image' } = props;
    const classes = useMatStyles();

    const addAdditionalQuestion = (item: ImageTestItemModel) => example.fields.push(item.questionControl);
    const deleteAdditionalQuestion = () => example.fields.pop();

    return (
      <Card style={{ borderTop: '3px solid dodgerblue' }}>
        <CardHeader title={title} action={action} />
        <Collapse in={!collapsed} timeout="auto" unmountOnExit>
          <CardContent style={{ paddingTop: 0 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TagsGroup value={example.tags} onChange={newTags => (example.tags = newTags)} />
              </Grid>
              {/*Description for this example*/}
              {example.fields && example.fields[0] && (
                <Grid item xs={12}>
                  <SurveyControl control={example.fields[0]} />
                </Grid>
              )}
              {/*File drop grid with type*/}
              <Grid item xs={12}>
                <TestItemDropGridList example={example} type={type} />
              </Grid>
              {/*Question fields*/}
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
        {/*<CardActions style={{justifyContent: 'flex-end', paddingTop: 0}}>
    </CardActions>*/}
      </Card>
    );
  },
);
