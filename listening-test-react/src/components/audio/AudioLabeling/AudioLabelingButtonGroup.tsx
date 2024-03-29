import {observer} from "mobx-react";
import {AudioTestItemModel} from "../../../shared/models/AudioTestModel";
import {SurveyControlType, TestItemType} from "../../../shared/models/EnumsAndTypes";
import {v4} from "uuid";
import {Box} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {AddQuestionButton} from "../../utils/AddQuestionButton";
import {useMatStyles} from "../../../shared/SharedStyles";

export const AudioLabelingButtonGroup = observer(function (props: { onAdd: (_: AudioTestItemModel) => void }) {
  const {onAdd} = props;
  const classes = useMatStyles();

  const handleAddTraining = () => onAdd({
    id: v4(), type: TestItemType.training, title: 'Title (click to edit)', example: {
      fields: [{
        type: SurveyControlType.description,
        question: 'Please listen these clips and try to write down what you heard.',
        value: null
      }], medias: []
    }
  });

  return <Box className={classes.elementGroup}>
    <Button variant="outlined" color="primary" onClick={handleAddTraining}>
      <Icon>add</Icon>Add Labeling Item
    </Button>
    <AddQuestionButton onAdd={onAdd}/>
  </Box>
});
