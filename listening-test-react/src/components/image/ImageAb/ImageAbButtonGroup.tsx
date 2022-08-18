import { observer } from 'mobx-react';
import React from 'react';
import { v4 } from 'uuid';

import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import { useMatStyles } from '../../../shared/SharedStyles';
import { SurveyControlType, TestItemType } from '../../../shared/models/EnumsAndTypes';
import { ImageTestItemModel } from '../../../shared/models/ImageTaskModel';
import { AddQuestionButton } from '../../utils/AddQuestionButton';

export const ImageAbButtonGroup = observer(function (props: { onAdd: (type: ImageTestItemModel) => void }) {
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
            question: 'Select your preference from the options below',
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
      <Button variant="outlined" color="primary" onClick={handleAddExample}>
        <Icon>add</Icon>Add Example
      </Button>
      <AddQuestionButton onAdd={onAdd} />
    </Box>
  );
});
