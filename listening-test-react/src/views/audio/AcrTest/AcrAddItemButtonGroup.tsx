import {observer} from "mobx-react";
import {AudioTestItemModel} from "../../../shared/models/AudioTestModel";
import {useMatStyles} from "../../SharedStyles";
import React, {useRef} from "react";
import {AddQuestionButton, AddQuestionButtonType} from "../../../shared/components/AddQuestionButton";
import {SurveyControlType, TestItemType} from "../../../shared/models/EnumsAndTypes";
import {uuid} from "uuidv4";
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
          id: uuid(), type: TestItemType.example, title: 'Title (Click to edit this)', example: {
            medias: [], fields: []
          }
        });
        break;
      case TestItemType.training:
        onAdd({
          id: uuid(), type: TestItemType.training, title: 'Training Example (Click to edit this)', example: {
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
          <Icon fontSize="small">add_task</Icon>
        </ListItemIcon>
        <ListItemText>ACR Test</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => handleAdd(TestItemType.training)}>
        <ListItemIcon>
          <Icon fontSize="small">fitness_center</Icon>
        </ListItemIcon>
        <ListItemText>Audio Training Example</ListItemText>
      </MenuItem>
    </AddQuestionButton>
  </Box>;
});
