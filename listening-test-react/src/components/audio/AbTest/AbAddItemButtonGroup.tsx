import { observer } from 'mobx-react';
import React, { useRef } from 'react';
import { v4 } from 'uuid';

import { Box, ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

import { useMatStyles } from '../../../shared/SharedStyles';
import { AudioTestItemModel } from '../../../shared/models/AudioTestModel';
import { SurveyControlType, TestItemType } from '../../../shared/models/EnumsAndTypes';
import { AddQuestionButton, AddQuestionButtonType } from '../../utils/AddQuestionButton';

export const AbAddItemButtonGroup = observer(function (props: { onAdd: (type: AudioTestItemModel) => void }) {
  const { onAdd } = props;
  const classes = useMatStyles();
  const addQuestionMenu = useRef<AddQuestionButtonType>();

  const handleAddExample = () => {
    addQuestionMenu.current?.closeMenu();
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
          { type: SurveyControlType.text, question: 'Briefly comment on your choice.', value: null, required: false },
        ],
        medias: [null, null],
      },
    });
  };

  const handleAddTraining = () => {
    addQuestionMenu.current?.closeMenu();
    onAdd({
      id: v4(),
      type: TestItemType.training,
      title: 'Title (click to edit)',
      example: {
        fields: [{ type: SurveyControlType.description, question: 'Please listen these sounds.', value: null }],
        medias: [],
      },
    });
  };

  return (
    <Box className={classes.elementGroup}>
      {/*<Button variant="outlined" color="primary">
      <Icon>add</Icon>Add Section
    </Button>*/}
      <AddQuestionButton ref={addQuestionMenu} onAdd={onAdd}>
        <MenuItem onClick={handleAddExample} data-testid="buttonAddEx">
          <ListItemIcon>
            <Icon fontSize="small" style={{ color: 'dodgerblue' }}>
              add_task
            </Icon>
          </ListItemIcon>
          <ListItemText>Audio AB Test</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAddTraining}>
          <ListItemIcon>
            <Icon fontSize="small" style={{ color: 'coral' }}>
              fitness_center
            </Icon>
          </ListItemIcon>
          <ListItemText>Audio Training Example</ListItemText>
        </MenuItem>
      </AddQuestionButton>
    </Box>
  );
});
