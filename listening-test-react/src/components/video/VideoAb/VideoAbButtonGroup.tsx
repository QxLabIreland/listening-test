import {observer} from "mobx-react";
import {SurveyControlType, TestItemType} from "../../../shared/models/EnumsAndTypes";
import {v4} from "uuid";
import {Box} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {AddQuestionButton} from "../../utils/AddQuestionButton";
import {useMatStyles} from "../../../shared/SharedStyles";
import {BasicTaskItemModel} from "../../../shared/models/BasicTaskModel";

export const VideoAbButtonGroup = observer(function (props: { onAdd: (type: BasicTaskItemModel) => void }) {
  const {onAdd} = props;
  const classes = useMatStyles();

  const handleAddExample = () => onAdd({
    id: v4(), type: TestItemType.example,
    title: 'Title (click to edit)',
    example: {
      fields: [{
        type: SurveyControlType.radio,
        question: 'Select your preference from the options below.',
        options: ['A', 'B'],
        value: null,
        required: true
      }],
      medias: [null, null]
    }
  });

  return <Box className={classes.elementGroup}>
    <Button variant="outlined" color="primary" onClick={handleAddExample} data-testid='buttonAddEx'>
      <Icon>add</Icon>Add Video Example
    </Button>
    <AddQuestionButton onAdd={onAdd}/>
  </Box>
});
