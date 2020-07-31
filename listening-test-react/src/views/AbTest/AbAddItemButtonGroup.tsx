import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {SurveyControlType, TestItemType} from "../../shared/models/EnumsAndTypes";
import {uuid} from "uuidv4";
import {Box} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {AddQuestionButton} from "../../shared/components/AddQuestionButton";
import {SurveyControlModel} from "../../shared/models/SurveyControlModel";
import {useMatStyles} from "../SharedStyles";

export const AbAddItemButtonGroup = observer(function (props: { onAdd: (type: TestItemModel) => void }) {
  const {onAdd} = props;
  const classes = useMatStyles();

  const handleAddExample = () => onAdd({
    id: uuid(),
    type: TestItemType.example,
    title: 'Example (click to edit)',
    example: {
      fields: [{
        type: SurveyControlType.radio,
        question: 'Which one is your preference?',
        options: ['A', 'B'],
        value: null,
        required: true
      }, {type: SurveyControlType.text, question: 'Briefly comment on your choice.', value: null, required: false}],
      audios: [null, null]
    }
  });

  const handleAddTraining = () => onAdd({
    id: uuid(), type: TestItemType.training, title: 'Training (click to edit)', example: {
      fields: [
        {type: SurveyControlType.description, question: 'Please listen these sounds.', value: null}
      ], audios: []
    }
  });

  const handleQuestionAdd = (question: SurveyControlModel) => {
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

  return <Box className={classes.elementGroup}>
    <Button variant="outlined" color="primary" onClick={handleAddExample}>
      <Icon>add</Icon>Add Example
    </Button>
    <Button variant="outlined" color="primary" onClick={handleAddTraining}>
      <Icon>add</Icon>Add Training Example
    </Button>
    <AddQuestionButton onQuestionAdd={handleQuestionAdd}/>
  </Box>
});
