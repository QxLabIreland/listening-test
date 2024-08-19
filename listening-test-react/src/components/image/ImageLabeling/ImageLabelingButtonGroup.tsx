import { observer } from 'mobx-react';
import React from 'react';
import { v4 } from 'uuid';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';

import { AddQuestionButton } from '../../../app/test-details/add-buttons/AddQuestionButton';
import { useMatStyles } from '../../../shared/SharedStyles';
import { TestItemType } from '../../../shared/enums/test-items';
import { SurveyControlType } from '../../../shared/enums/test-items';
import { ImageTestItemModel } from '../../../shared/models/ImageTaskModel';

export const ImageLabelingButtonGroup = observer(function (props: { onAdd: (_: ImageTestItemModel) => void }) {
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
            type: SurveyControlType.description,
            question: 'Please write down what you see on the picture.',
            value: null,
          },
        ],
        medias: [],
      },
    });

  return (
    <Box className={classes.elementGroup}>
      <Button variant="outlined" color="primary" onClick={handleAddExample}>
        <Icon>add</Icon>Add Image Labeling Item
      </Button>
      <AddQuestionButton onAdd={onAdd} />
    </Box>
  );
});
