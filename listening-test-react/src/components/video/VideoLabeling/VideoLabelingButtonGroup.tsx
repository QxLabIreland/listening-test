import { observer } from 'mobx-react';
import { v4 } from 'uuid';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import React from 'react';
import { AddQuestionButton } from '../../utils/AddQuestionButton';
import { useMatStyles } from '../../../shared/SharedStyles';
import { ImageTestItemModel } from '../../../shared/models/ImageTaskModel';
import { SurveyControlType, TestItemType } from '../../../shared/enums/EnumsAndTypes';

export const VideoLabelingButtonGroup = observer(function (props: { onAdd: (_: ImageTestItemModel) => void }) {
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
            question: 'Please describe these video.',
            value: null,
          },
        ],
        medias: [],
      },
    });

  return (
    <Box className={classes.elementGroup}>
      <Button variant="outlined" color="primary" onClick={handleAddExample}>
        <Icon>add</Icon>Add Video Labeling Item
      </Button>
      <AddQuestionButton onAdd={onAdd} />
    </Box>
  );
});
