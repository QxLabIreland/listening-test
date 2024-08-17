import { observer } from 'mobx-react';
import React from 'react';
import { v4 } from 'uuid';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';

import { useMatStyles } from '../../../shared/SharedStyles';
import { TestItemType } from '../../../shared/enums/test-items';
import { SurveyControlType } from '../../../shared/enums/test-items';
import { BasicTaskItemModel } from '../../../shared/models/BasicTaskModel';
import { AddQuestionButton } from '../../utils/AddQuestionButton';

export const VideoAbButtonGroup = observer(function (props: { onAdd: (type: BasicTaskItemModel) => void }) {
  const { onAdd } = props;
  const classes = useMatStyles();

  const handleAddExample = () =>
    onAdd({
      id: v4(),
      type: TestItemType.example,
      title: 'Title (click to edit)',
      example: {
        fields: [
          {
            type: SurveyControlType.radio,
            question: 'Select your preference from the options below.',
            options: ['A', 'B'],
            value: null,
            required: true,
          },
        ],
        medias: [null, null],
      },
    });

  return (
    <Box className={classes.elementGroup}>
      <Button variant="outlined" color="primary" onClick={handleAddExample} data-testid="buttonAddEx">
        <Icon>add</Icon>Add Video Example
      </Button>
      <AddQuestionButton onAdd={onAdd} />
    </Box>
  );
});
