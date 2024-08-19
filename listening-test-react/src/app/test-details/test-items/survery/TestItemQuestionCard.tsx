import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import { CardContent, Collapse, FormControlLabel, Switch } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { labelInputStyle } from '../../../../shared/SharedStyles';
import { SurveyControlType, TestItemType } from '../../../../shared/enums/test-items';
import { BasicTaskItemModel } from '../../../../shared/models/BasicTaskModel';
import { testDetails } from '../../test-details-store';
import HeaderIconButtons from '../components/HeaderIconButtons';
import { SurveyControl } from './SurveyControl';

/** Question Card for survey questions*/
export default observer(function TestItemQuestionCard({ item }: { item: BasicTaskItemModel; disableGoto?: boolean }) {
  // Find the index of current item
  const curIndex = testDetails.data.items.findIndex(value => value.id === item.id);
  // If the index is at end of list, the goto feature will be delete
  const gotoQuestionItems =
    curIndex >= testDetails.data.items.length - 1
      ? undefined
      : testDetails.data.items
          .slice(curIndex + 2)
          .filter(item => item.type !== TestItemType.sectionHeader)
          .map(item => ({ id: item.id, title: item.title }));

  return (
    <Card style={{ borderTop: '3px solid green' }}>
      <CardHeader
        title={
          <input
            style={labelInputStyle}
            value={item.title}
            onChange={e => runInAction(() => (item.title = e.target.value))}
            onFocus={event => event.target.select()}
          />
        }
        action={
          <>
            {item.questionControl.type !== SurveyControlType.description && (
              <FormControlLabel
                label="Required"
                control={
                  <Switch
                    checked={item.questionControl.required}
                    onChange={e =>
                      runInAction(() => {
                        item.questionControl.required = e.target.checked;
                      })
                    }
                  />
                }
              />
            )}
            <HeaderIconButtons item={item} />
          </>
        }
      />
      <Collapse in={!item.collapsed} timeout="auto" unmountOnExit>
        <CardContent style={{ paddingTop: 0 }}>
          <SurveyControl
            control={item.questionControl}
            disableGoto={!testDetails.data.settings?.isIndividual}
            // Filter current item out of list
            gotoQuestionItems={gotoQuestionItems}
          />
        </CardContent>
      </Collapse>
    </Card>
  );
});
