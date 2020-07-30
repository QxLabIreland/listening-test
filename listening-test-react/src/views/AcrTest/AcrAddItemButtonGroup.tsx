import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {SurveyControlType, TestItemType, TestUrl} from "../../shared/models/EnumsAndTypes";
import {uuid} from "uuidv4";
import {Box} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {AddQuestionButton} from "../../shared/components/AddQuestionButton";
import {SurveyControlModel} from "../../shared/models/SurveyControlModel";
import {useElementGroupStyle} from "../SharedStyles";

export const AcrAddItemButtonGroup = observer(function (props: { onAdd: (type: TestItemModel) => void, testUrl?: TestUrl }) {
  const {onAdd, testUrl} = props;
  const classes = useElementGroupStyle();
  const disableTraining: boolean = testUrl === 'ab-test' || testUrl === 'hearing-test';

  const handleAdd = (type: TestItemType) => {
    let newItem: TestItemModel;
    switch (type) {
      case TestItemType.example:
        newItem = {
          id: uuid(), type: TestItemType.example, title: 'Example (Click to edit this)', example: {
            audios: [], fields: [
              {type: SurveyControlType.description, question: 'Rate the quality of these sounds.', value: null}
            ]
          }
        };
        break;
      case TestItemType.training:
        newItem = {
          id: uuid(), type: TestItemType.training, title: 'Training Example (Click to edit this)', example: {
            audios: [], fields: [
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

  const handleQuestionAdd = (question: SurveyControlModel) => {
    // Bad solution for scrolling
    const timer = setTimeout(() => {
      onAdd({
        id: uuid(), type: TestItemType.question, title: 'Survey Question (Click to edit this)', questionControl: question
      });
      clearTimeout(timer);
    });
  };

  return <Box className={classes.elementGroup}>
    <Button variant="outlined" color="primary" onClick={() => handleAdd(TestItemType.example)}>
      <Icon>add</Icon>Add Example
    </Button>
    {!disableTraining && <Button variant="outlined" color="primary" onClick={() => handleAdd(TestItemType.training)}>
      <Icon>add</Icon>Add Training Example
    </Button>}
    <AddQuestionButton onQuestionAdd={handleQuestionAdd}/>
  </Box>
});
