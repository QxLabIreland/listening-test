import { observer } from 'mobx-react';
import React, { PropsWithChildren, forwardRef, useContext, useImperativeHandle, useState } from 'react';
import { uuid } from 'uuidv4';

import { Divider, ListItemIcon, ListItemText, ListSubheader, Menu, MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';

import { DetailTaskModel } from '../../shared/ReactContexts';
import { BasicTaskItemModel } from '../../shared/models/BasicTaskModel';
import { SurveyControlType, TestItemType } from '../../shared/models/EnumsAndTypes';
import { SurveyControlModel } from '../../shared/models/SurveyControlModel';

export type AddQuestionButtonType = { closeMenu: () => void };

const useStyles = makeStyles(() => ({
  questionIcon: { color: 'green' },
}));

export const AddQuestionButton = observer(
  forwardRef<
    AddQuestionButtonType,
    PropsWithChildren<{
      onAdd: (type: BasicTaskItemModel) => void;
      onlyCore?: boolean;
    }>
  >(function (props, forwardedRef) {
    // If props doesn't have anchorEl and setAnchorEl, we are gonna use copied one
    const { onAdd, onlyCore } = props;
    const [anchorEl, setAnchorEl] = useState<HTMLElement>();
    // Close menu from parent components
    useImperativeHandle(forwardedRef, () => ({
      closeMenu: () => setAnchorEl(null),
    }));
    const taskModel = useContext(DetailTaskModel);
    const classes = useStyles();

    // When menu clicked
    const handleAddMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleAdd = (type: SurveyControlType) => {
      const handleSurveyQuestionItemAdd = (question: SurveyControlModel) => {
        // Bad solution for scrolling
        const timer = setTimeout(() => {
          onAdd({
            id: uuid(),
            type: TestItemType.question,
            title: 'Title (click to edit)',
            questionControl: question,
          });
          clearTimeout(timer);
        });
      };
      // Close the adding menu
      setAnchorEl(null);
      // Check controls types
      switch (type) {
        case SurveyControlType.radio:
        case SurveyControlType.checkbox:
          handleSurveyQuestionItemAdd({
            type: type,
            question: 'Untitled question',
            options: ['Add your options!'],
            value: null,
            required: true,
          });
          break;
        case SurveyControlType.text:
          handleSurveyQuestionItemAdd({ type: type, question: 'Untitled question', value: null, required: true });
          break;
        case SurveyControlType.description:
          handleSurveyQuestionItemAdd({ type: type, question: 'Type you description here', value: null });
          break;
      }
    };
    const handleCopyLastItem = () => {
      setAnchorEl(null);
      const newItem: BasicTaskItemModel = JSON.parse(JSON.stringify(taskModel.items[taskModel.items.length - 1]));
      newItem.id = uuid();
      onAdd(newItem);
    };
    // Add section header
    const handleAddSectionHeader = () => {
      setAnchorEl(null);
      onAdd({
        id: uuid(),
        type: TestItemType.sectionHeader,
        title: 'Group Divider (This will not visible to the participant)',
      });
    };
    // Get rid of other types of question
    if (onlyCore)
      return (
        <>
          <Button color="primary" onClick={handleAddMenuClick}>
            <Icon>add</Icon> Ask a question
          </Button>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => handleAdd(SurveyControlType.text)}>
              <ListItemIcon>
                <Icon fontSize="small">text_fields</Icon>
              </ListItemIcon>
              <ListItemText primary="Text Input" />
            </MenuItem>
            <MenuItem onClick={() => handleAdd(SurveyControlType.radio)}>
              <ListItemIcon>
                <Icon fontSize="small">radio_button_checked</Icon>
              </ListItemIcon>
              <ListItemText primary="Radio Group" />
            </MenuItem>
            <MenuItem onClick={() => handleAdd(SurveyControlType.checkbox)}>
              <ListItemIcon>
                <Icon fontSize="small">check_box</Icon>
              </ListItemIcon>
              <ListItemText primary="Checkbox Group" />
            </MenuItem>
          </Menu>
        </>
      );
    // Full feature add question menu
    else
      return (
        <>
          <Button variant="outlined" color="primary" onClick={handleAddMenuClick} data-testid="openAddMenu">
            <Icon>more_vert</Icon>Add Question
          </Button>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
            {/*<MenuItem disabled>
        <Typography variant="body1"><strong>Test Item Type</strong></Typography>
      </MenuItem>*/}
            <ListSubheader>Question Type</ListSubheader>
            {props.children}
            <MenuItem onClick={handleAddSectionHeader}>
              <ListItemIcon>
                <Icon fontSize="small">view_agenda</Icon>
              </ListItemIcon>
              <ListItemText>Group Divider</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleAdd(SurveyControlType.text)}>
              <ListItemIcon>
                <Icon fontSize="small" className={classes.questionIcon}>
                  text_fields
                </Icon>
              </ListItemIcon>
              <ListItemText primary="Text Input" />
            </MenuItem>
            <MenuItem onClick={() => handleAdd(SurveyControlType.radio)}>
              <ListItemIcon>
                <Icon fontSize="small" className={classes.questionIcon}>
                  radio_button_checked
                </Icon>
              </ListItemIcon>
              <ListItemText primary="Radio Group" />
            </MenuItem>
            <MenuItem onClick={() => handleAdd(SurveyControlType.checkbox)}>
              <ListItemIcon>
                <Icon fontSize="small" className={classes.questionIcon}>
                  check_box
                </Icon>
              </ListItemIcon>
              <ListItemText primary="Checkbox Group" />
            </MenuItem>
            <MenuItem onClick={() => handleAdd(SurveyControlType.description)}>
              <ListItemIcon>
                <Icon fontSize="small" className={classes.questionIcon}>
                  label
                </Icon>
              </ListItemIcon>
              <ListItemText primary="A Text Label" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleCopyLastItem} disabled={!taskModel.items[taskModel.items.length - 1]}>
              <ListItemIcon>
                <Icon fontSize="small">content_copy</Icon>
              </ListItemIcon>
              <ListItemText primary="Copy Previous Question" />
            </MenuItem>
          </Menu>
        </>
      );
  })
);
