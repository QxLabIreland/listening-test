import { observer } from 'mobx-react';
import React from 'react';
import { v4 } from 'uuid';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';

import { useMatStyles } from '../../../shared/SharedStyles';
import { TestItemType } from '../../../shared/enums/test-items';
import { SurveyControlType } from '../../../shared/enums/test-items';
import { AudioTestItemModel } from '../../../shared/models/AudioTestModel';
import { AddQuestionButton } from '../../utils/AddQuestionButton';

export const AudioLabelingButtonGroup = observer(function (props: { onAdd: (_: AudioTestItemModel) => void }) {
  const { onAdd } = props;
  const classes = useMatStyles();

  const handleAddTraining = () =>
    onAdd({
      id: v4(),
      type: TestItemType.training,
      title: 'Title (click to edit)',
      example: {
        fields: [
          {
            type: SurveyControlType.description,
            question: 'Please listen these clips and try to write down what you heard.',
            value: null,
          },
        ],
        medias: [],
      },
    });

  return (
    <Box className={classes.elementGroup}>
      <Button variant="outlined" color="primary" onClick={handleAddTraining}>
        <Icon>add</Icon>Add Labeling Item
      </Button>
      <AddQuestionButton onAdd={onAdd} />
    </Box>
  );
});
