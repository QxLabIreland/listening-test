import {observer} from "mobx-react";
import {AudioTestItemModel} from "../../../shared/models/AudioTestModel";
import {SurveyControlType, TestItemType} from "../../../shared/models/EnumsAndTypes";
import {uuid} from "uuidv4";
import {Box, ListItemIcon, ListItemText, MenuItem} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import React, {useRef} from "react";
import {AddQuestionButton, AddQuestionButtonType} from "../../../shared/components/AddQuestionButton";
import {useMatStyles} from "../../SharedStyles";

export const HearingAddItemButtons = observer(function (props: { onAdd: (type: AudioTestItemModel) => void }) {
  const {onAdd} = props;
  const classes = useMatStyles();
  const addQuestionMenu = useRef<AddQuestionButtonType>();

  const handleAdd = (type: TestItemType) => {
    addQuestionMenu.current.closeMenu();
    switch (type) {
      case TestItemType.example: onAdd({
          id: uuid(), type: TestItemType.example, title: 'Title (Click to edit this)', example: {
            medias: [{filename: null, src: null, value: null, settings: {initVolume: 0.5, frequency: 500}}], fields: [
              {type: SurveyControlType.description, question: 'Use the slider below to reduce the volume of this tone until it is just audible. When complete, click "Next"', value: null}
            ]
          }
        }); break;
      case TestItemType.training: onAdd({
        id: uuid(), type: TestItemType.training, title: 'Calibration for audio hardware volume (Click to edit this)', example: {
          medias: [], fields: [
            {type: SurveyControlType.description, question: 'Please listen and follow the instructions to calibrate your audio device.', value: null}
          ]
        }
      }); break;
    }
  }

  return <Box className={classes.elementGroup}>
    <AddQuestionButton ref={addQuestionMenu} onAdd={onAdd}>
      <MenuItem onClick={() => handleAdd(TestItemType.example)}>
        <ListItemIcon>
          <Icon fontSize="small">add_task</Icon>
        </ListItemIcon>
        <ListItemText>Hearing Test</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => handleAdd(TestItemType.training)}>
        <ListItemIcon>
          <Icon fontSize="small">fitness_center</Icon>
        </ListItemIcon>
        <ListItemText>Calibration Step</ListItemText>
      </MenuItem>
    </AddQuestionButton>
  </Box>
});

