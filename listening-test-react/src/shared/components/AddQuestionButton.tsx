import {observer} from "mobx-react";
import {SurveyControlModel} from "../models/SurveyControlModel";
import React, {useState} from "react";
import {SurveyControlType, TestItemType} from "../models/EnumsAndTypes";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import {ListItemIcon, ListItemText, Menu, MenuItem, Typography} from "@material-ui/core";
import {uuid} from "uuidv4";
import {BasicTaskItemModel} from "../models/BasicTaskModel";

export const handleSurveyQuestionItemAdd = (question: SurveyControlModel, onAdd: (_: BasicTaskItemModel) => void) => {
  // Bad solution for scrolling
  const timer = setTimeout(() => {
    onAdd({
      id: uuid(),
      type: TestItemType.question,
      title: 'Survey Question (click to edit)',
      questionControl: question
    });
    clearTimeout(timer);
  });
};

export const AddQuestionButton = observer(function (props: { onQuestionAdd: (question: SurveyControlModel) => void, onlyCore?: boolean }) {
  const {onQuestionAdd, onlyCore} = props;
  // When menu clicked
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleAddMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAdd = (type: SurveyControlType) => {
    // Close the adding menu
    setAnchorEl(null);
    // Check controls types
    switch (type) {
      case SurveyControlType.radio:
      case SurveyControlType.checkbox:
        onQuestionAdd({
          type: type,
          question: 'Untitled question',
          options: ['Add your options!'],
          value: null,
          required: true
        });
        break;
      case SurveyControlType.text:
        onQuestionAdd({type: type, question: 'Untitled question', value: null, required: true});
        break;
      case SurveyControlType.description:
        onQuestionAdd({type: type, question: 'Type you description here', value: null});
        break;
    }
  }

  // Get rid of other types of question
  if (onlyCore) return <>
    <Button color="primary" onClick={handleAddMenuClick}><Icon>add</Icon> Ask a question</Button>
    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
      <MenuItem onClick={() => handleAdd(SurveyControlType.text)}>
        <ListItemIcon>
          <Icon fontSize="small">text_fields</Icon>
        </ListItemIcon>
        <ListItemText primary="Text Input"/>
      </MenuItem>
      <MenuItem onClick={() => handleAdd(SurveyControlType.radio)}>
        <ListItemIcon>
          <Icon fontSize="small">radio_button_checked</Icon>
        </ListItemIcon>
        <ListItemText primary="Radio Group"/>
      </MenuItem>
      <MenuItem onClick={() => handleAdd(SurveyControlType.checkbox)}>
        <ListItemIcon>
          <Icon fontSize="small">check_box</Icon>
        </ListItemIcon>
        <ListItemText primary="Checkbox Group"/>
      </MenuItem>
    </Menu>
  </>
  else return <>
    <Button variant="outlined" color="primary" onClick={handleAddMenuClick}><Icon>more_vert</Icon>Add Survey
      Question</Button>
    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
      <MenuItem disabled>
        <Typography variant="body1"><strong>Answer Input Type</strong></Typography>
      </MenuItem>
      <MenuItem onClick={() => handleAdd(SurveyControlType.text)}>
        <ListItemIcon>
          <Icon fontSize="small">text_fields</Icon>
        </ListItemIcon>
        <ListItemText primary="Text Input"/>
      </MenuItem>
      <MenuItem onClick={() => handleAdd(SurveyControlType.radio)}>
        <ListItemIcon>
          <Icon fontSize="small">radio_button_checked</Icon>
        </ListItemIcon>
        <ListItemText primary="Radio Group"/>
      </MenuItem>
      <MenuItem onClick={() => handleAdd(SurveyControlType.checkbox)}>
        <ListItemIcon>
          <Icon fontSize="small">check_box</Icon>
        </ListItemIcon>
        <ListItemText primary="Checkbox Group"/>
      </MenuItem>
      <MenuItem onClick={() => handleAdd(SurveyControlType.description)}>
        <ListItemIcon>
          <Icon fontSize="small">label</Icon>
        </ListItemIcon>
        <ListItemText primary="A Text Label"/>
      </MenuItem>
    </Menu>
  </>;
});
