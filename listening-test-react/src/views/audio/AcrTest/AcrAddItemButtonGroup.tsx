import {observer} from "mobx-react";
import {AudioTestItemModel} from "../../../shared/models/AudioTestModel";
import {SurveyControlType, TestItemType} from "../../../shared/models/EnumsAndTypes";
import {uuid} from "uuidv4";
import {Box} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {AddQuestionButton, handleSurveyQuestionItemAdd} from "../../../shared/components/AddQuestionButton";
import {useMatStyles} from "../../SharedStyles";

export const AcrAddItemButtonGroup = observer(function (props: { onAdd: (type: AudioTestItemModel) => void}) {
  const {onAdd} = props;
  const classes = useMatStyles();

  const handleAdd = (type: TestItemType) => {
    let newItem: AudioTestItemModel;
    switch (type) {
      case TestItemType.example:
        newItem = {
          id: uuid(), type: TestItemType.example, title: 'Example (Click to edit this)', example: {
            medias: [], fields: [
              {type: SurveyControlType.description, question: 'Rate the quality of these sounds.', value: null}
            ]
          }
        };
        break;
      case TestItemType.training:
        newItem = {
          id: uuid(), type: TestItemType.training, title: 'Training Example (Click to edit this)', example: {
            medias: [], fields: [
              {type: SurveyControlType.description, question: 'Please listen these sounds.', value: null}
            ]
          }
        };
        break;
      case TestItemType.sectionHeader:
        newItem = {
          id: uuid(), type: TestItemType.sectionHeader, title: 'This is section title', // titleDes: {title: 'New Title', description: 'Optional Description'}
        };
        break;
    }
    onAdd(newItem);
  }


  return <Box className={classes.elementGroup}>
    <Button variant="outlined" color="primary" onClick={() => handleAdd(TestItemType.example)}>
      <Icon>add</Icon>Add Example
    </Button>
    <Button variant="outlined" color="primary" onClick={() => handleAdd(TestItemType.training)}>
      <Icon>add</Icon>Add Training Example
    </Button>
    <AddQuestionButton onQuestionAdd={question => handleSurveyQuestionItemAdd(question, onAdd)}/>
  </Box>
});
