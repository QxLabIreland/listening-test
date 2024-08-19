import { observer } from 'mobx-react';
import React from 'react';

import { FormControlLabel, Switch, Tooltip } from '@mui/material';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';

import { SurveyControl } from '../../app/test-details/test-items/survery/SurveyControl';
import { useMatStyles } from '../../shared/SharedStyles';
import { SurveyControlModel } from '../../shared/models/SurveyControlModel';

const useStyles = makeStyles(() => ({
  controlGroup: { alignItems: 'start' },
  controlWrapper: { width: '100%' },
}));

export const RemovableSurveyControl = observer(function ({
  question,
  onRemove,
  hideRemoveButton,
  hideRequire,
  compactStyle,
}: {
  question: SurveyControlModel;
  onRemove: () => void;
  hideRemoveButton?: boolean;
  hideRequire?: boolean;
  compactStyle?: boolean;
}) {
  const classes = { ...useMatStyles(), ...useStyles() };

  const requireSwitch = !hideRequire && (
    <FormControlLabel
      label="Required"
      control={<Switch checked={question.required} onChange={e => (question.required = e.target.checked)} />}
    />
  );
  const deleteButton = !hideRemoveButton && (
    <Tooltip title="Remove this question">
      <IconButton onClick={onRemove}>
        <Icon>clear</Icon>
      </IconButton>
    </Tooltip>
  );
  const surveyControl = <SurveyControl control={question} />;

  if (compactStyle)
    return (
      <div className={classes.flexEnd + ' ' + classes.controlGroup}>
        <div className={classes.controlWrapper}>{surveyControl}</div>
        {requireSwitch}
        {deleteButton}
      </div>
    );
  else
    return (
      <>
        <div className={classes.flexEnd}>
          {requireSwitch}
          {deleteButton}
        </div>
        {surveyControl}
      </>
    );
});
