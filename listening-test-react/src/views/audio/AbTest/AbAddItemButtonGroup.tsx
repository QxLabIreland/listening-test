import {observer} from "mobx-react";
import {AudioTestItemModel} from "../../../shared/models/AudioTestModel";
import {SurveyControlType, TestItemType} from "../../../shared/models/EnumsAndTypes";
import {uuid} from "uuidv4";
import {Box} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {AddQuestionButton, handleSurveyQuestionItemAdd} from "../../../shared/components/AddQuestionButton";
import {SurveyControlModel} from "../../../shared/models/SurveyControlModel";
import {useMatStyles} from "../../SharedStyles";

export const AbAddItemButtonGroup = observer(function (props: { onAdd: (type: AudioTestItemModel) => void }) {
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
      medias: [null, null]
    }
  });

  const handleAddTraining = () => onAdd({
    id: uuid(), type: TestItemType.training, title: 'Training (click to edit)', example: {
      fields: [
        {type: SurveyControlType.description, question: 'Please listen these sounds.', value: null}
      ], medias: []
    }
  });

  return <Box className={classes.elementGroup}>
    <Button variant="outlined" color="primary" onClick={handleAddExample} data-testid='buttonAddEx'>
      <Icon>add</Icon>Add Example
    </Button>
    <Button variant="outlined" color="primary" onClick={handleAddTraining}>
      <Icon>add</Icon>Add Training Example
    </Button>
    <AddQuestionButton onQuestionAdd={question => handleSurveyQuestionItemAdd(question, onAdd)}/>
  </Box>
});
