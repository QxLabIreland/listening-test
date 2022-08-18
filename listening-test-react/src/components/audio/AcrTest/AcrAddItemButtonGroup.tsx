import {observer} from "mobx-react";
import {AudioTestItemModel} from "../../../shared/models/AudioTestModel";
import {useMatStyles} from "../../../shared/SharedStyles";
import React, {useRef} from "react";
import {AddQuestionButton, AddQuestionButtonType} from "../../utils/AddQuestionButton";
import {SurveyControlType, TestItemType} from "../../../shared/models/EnumsAndTypes";
import {v4} from "uuid";
import {Box, ListItemIcon, ListItemText, MenuItem} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";

export const AcrAddItemButtonGroup = observer(function (props: { onAdd: (type: AudioTestItemModel) => void }) {
  const {onAdd} = props;
  const classes = useMatStyles();
  const addQuestionMenu = useRef<AddQuestionButtonType>();

  const handleAdd = (type: TestItemType) => {
    addQuestionMenu.current.closeMenu();
    switch (type) {
      case TestItemType.example:
        onAdd({
          id: v4(), type: TestItemType.example, title: 'Title (Click to edit this)', example: {
            medias: [], fields: []
          }
        });
        break;
      case TestItemType.training:
        onAdd({
          id: v4(), type: TestItemType.training, title: 'Training Example (Click to edit this)', example: {
            medias: [], fields: [
              {type: SurveyControlType.description, question: 'Please listen these sounds.', value: null}
            ]
          }
        });
        break;
    }
  };


  return <Box className={classes.elementGroup}>
    <AddQuestionButton ref={addQuestionMenu} onAdd={onAdd}>
      <MenuItem onClick={() => handleAdd(TestItemType.example)}>
        <ListItemIcon>
          <Icon fontSize="small" style={{color: 'dodgerblue'}}>add_task</Icon>
        </ListItemIcon>
        <ListItemText>ACR Test</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => handleAdd(TestItemType.training)}>
        <ListItemIcon>
          <Icon fontSize="small" style={{color: 'coral'}}>fitness_center</Icon>
        </ListItemIcon>
        <ListItemText>Audio Training Example</ListItemText>
      </MenuItem>
    </AddQuestionButton>
  </Box>;
});
