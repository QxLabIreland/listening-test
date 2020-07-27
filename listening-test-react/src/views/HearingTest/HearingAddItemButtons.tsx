import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {SurveyControlType, TestItemType} from "../../shared/models/EnumsAndTypes";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {uuid} from "uuidv4";
import {Box} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {AddQuestionButton} from "../../shared/components/AddQuestionButton";
import {SurveyControlModel} from "../../shared/models/SurveyControlModel";

const useStyles = makeStyles((theme: Theme) => createStyles({
  buttonGroup: {
    '& > *': {margin: theme.spacing(0.5)}
  }
}));

export const HearingAddItemButtons = observer(function (props: { onAdd: (type: TestItemModel) => void }) {
  const {onAdd} = props;
  const classes = useStyles();

  const handleAdd = (type: TestItemType) => {
    switch (type) {
      case TestItemType.example: onAdd({
          id: uuid(), type: TestItemType.example, title: 'Example (Click to edit this)', example: {
            audios: [{filename: null, src: null, value: null, settings: {initVolume: 0.5, frequency: 500}}], fields: [
              {type: SurveyControlType.description, question: 'Use the slider below to reduce the volume of this tone until it is just audible. When complete, click "Next"', value: null}
            ]
          }
        }); break;
      case TestItemType.sectionHeader: onAdd({
          id: uuid(), type: TestItemType.sectionHeader, title: 'Training Example', // titleDes: {title: 'New Title', description: 'Optional Description'}
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

  return <Box className={classes.buttonGroup}>
    <Button variant="outlined" color="primary" onClick={() => handleAdd(TestItemType.example)}>
      <Icon>add</Icon>Add Example
    </Button>
    <AddQuestionButton onQuestionAdd={handleQuestionAdd}/>
  </Box>
});

