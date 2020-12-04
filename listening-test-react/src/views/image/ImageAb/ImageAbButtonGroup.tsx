import {observer} from "mobx-react";
import {SurveyControlType, TestItemType} from "../../../shared/models/EnumsAndTypes";
import {uuid} from "uuidv4";
import {Box} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {AddQuestionButton} from "../../../shared/components/AddQuestionButton";
import {useMatStyles} from "../../SharedStyles";
import {ImageTestItemModel} from "../../../shared/models/ImageTaskModel";

export const ImageAbButtonGroup = observer(function (props: { onAdd: (type: ImageTestItemModel) => void }) {
  const {onAdd} = props;
  const classes = useMatStyles();

  const handleAddExample = () => onAdd({
    id: uuid(),
    type: TestItemType.example,
    title: 'Image Ab Example (click to edit)',
    example: {
      fields: [{
        type: SurveyControlType.radio,
        question: 'Select your preference from the options below',
        options: ['A', 'B'],
        value: null,
        required: true
      }],
      medias: [null, null]
    }
  });

  return <Box className={classes.elementGroup}>
    <Button variant="outlined" color="primary" onClick={handleAddExample} data-testid='buttonAddEx'>
      <Icon>add</Icon>Add Example
    </Button>
    <AddQuestionButton onAdd={onAdd}/>
  </Box>
});
