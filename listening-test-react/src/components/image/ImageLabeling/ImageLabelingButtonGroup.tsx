import {observer} from "mobx-react";
import {v4} from "uuid";
import {Box} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {AddQuestionButton} from "../../utils/AddQuestionButton";
import {useMatStyles} from "../../../shared/SharedStyles";
import {ImageTestItemModel} from "../../../shared/models/ImageTaskModel";
import {SurveyControlType, TestItemType} from "../../../shared/models/EnumsAndTypes";

export const ImageLabelingButtonGroup = observer(function (props: { onAdd: (_: ImageTestItemModel) => void }) {
  const {onAdd} = props;
  const classes = useMatStyles();

  const handleAddExample = () => onAdd({
    id: v4(), type: TestItemType.example, title: 'Title (click to edit)', example: {
      fields: [{
        type: SurveyControlType.description,
        question: 'Please write down what you see on the picture.',
        value: null
      }], medias: []
    }
  });

  return <Box className={classes.elementGroup}>
    <Button variant="outlined" color="primary" onClick={handleAddExample}>
      <Icon>add</Icon>Add Image Labeling Item
    </Button>
    <AddQuestionButton onAdd={onAdd}/>
  </Box>
});
