import {observer} from "mobx-react";
import {AudioTestItemModel} from "../../../shared/models/AudioTestModel";
import {SurveyControlType, TestItemType} from "../../../shared/models/EnumsAndTypes";
import {uuid} from "uuidv4";
import {Box} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {AddQuestionButton} from "../../../shared/components/AddQuestionButton";
import {SurveyControlModel} from "../../../shared/models/SurveyControlModel";
import {useMatStyles} from "../../SharedStyles";

export const HearingAddItemButtons = observer(function (props: { onAdd: (type: AudioTestItemModel) => void }) {
  const {onAdd} = props;
  const classes = useMatStyles();

  const handleAdd = (type: TestItemType) => {
    switch (type) {
      case TestItemType.example: onAdd({
          id: uuid(), type: TestItemType.example, title: 'Example (Click to edit this)', example: {
            medias: [{filename: null, src: null, value: null, settings: {initVolume: 0.5, frequency: 500}}], fields: [
              {type: SurveyControlType.description, question: 'Use the slider below to reduce the volume of this tone until it is just audible. When complete, click "Next"', value: null}
            ]
          }
        }); break;
      case TestItemType.training: onAdd({
        id: uuid(), type: TestItemType.training, title: 'Calibration for hardware volume (Click to edit this)', example: {
          medias: [], fields: [
            {type: SurveyControlType.description, question: 'Please listen and follow the instruction to calibrate your device.', value: null}
          ]
        }
      }); break;
    }
  }

  const handleQuestionAdd = (question: SurveyControlModel) => {
    // Bad solution for scrolling
    const timer = setTimeout(() => {
      onAdd({
        id: uuid(),
        type: TestItemType.question,
        title: 'Survey Question (Click to edit this)',
        questionControl: question
      });
      clearTimeout(timer);
    });
  };

  return <Box className={classes.elementGroup}>
    <Button variant="outlined" color="primary" onClick={() => handleAdd(TestItemType.example)}>
      <Icon>add</Icon>Add Example
    </Button>
    <Button variant="outlined" color="primary" onClick={() => handleAdd(TestItemType.training)}>
      <Icon>add</Icon>Add Calibration Step
    </Button>
    <AddQuestionButton onQuestionAdd={handleQuestionAdd}/>
  </Box>
});

