import {observer} from "mobx-react";
import {uuid} from "uuidv4";
import {Box} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {AddQuestionButton, handleSurveyQuestionItemAdd} from "../../shared/components/AddQuestionButton";
import {useMatStyles} from "../SharedStyles";
import {ImageTestItemModel} from "../../shared/models/ImageTaskModel";
import {SurveyControlType, TestItemType} from "../../shared/models/EnumsAndTypes";

export const VideoLabelingButtonGroup = observer(function (props: { onAdd: (_: ImageTestItemModel) => void }) {
  const {onAdd} = props;
  const classes = useMatStyles();

  const handleAddExample = () => onAdd({
    id: uuid(), type: TestItemType.example, title: 'Video Labeling (click to edit)', example: {
      fields: [{
        type: SurveyControlType.description,
        question: 'Please describe these video.',
        value: null
      }], medias: []
    }
  });

  return <Box className={classes.elementGroup}>
    <Button variant="outlined" color="primary" onClick={handleAddExample}>
      <Icon>add</Icon>Add Video Labeling Item
    </Button>
    <AddQuestionButton onQuestionAdd={question => handleSurveyQuestionItemAdd(question, onAdd)}/>
  </Box>
});
