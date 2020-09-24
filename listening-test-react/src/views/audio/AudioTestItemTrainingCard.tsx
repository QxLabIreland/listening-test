import {observer} from "mobx-react";
import React, {useState} from "react";
import {TestItemExampleCardProps} from "../components/TypesAndItemOverrides";
import {AudioFileModel, AudioExampleSettingsModel} from "../../shared/models/AudioTestModel";
import {SurveyControlModel} from "../../shared/models/SurveyControlModel";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import AudioExampleSettingsDialog from "./AudioExampleSettingsDialog";
import {
  Button,
  CardContent,
  Collapse, createStyles,
  FormControlLabel,
  ListItemIcon, ListItemText,
  Menu,
  MenuItem,
  Switch, Theme,
  Tooltip
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {TestItemCardFileDropGrid} from "../components/TestItemCardFileDropGrid";
import {SurveyControl} from "../../shared/components/SurveyControl";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {FileDropZone} from "../../shared/components/FileDropZone";
import {SurveyControlType} from "../../shared/models/EnumsAndTypes";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((_: Theme) => {
  return createStyles({
    innerQuestionContainer: {display: 'flex', justifyContent: 'flex-end'}
  });
});
/** Training Test Item: Audios will play synchronously*/
export const AudioTestItemTrainingCard = observer((props: React.PropsWithChildren<TestItemExampleCardProps>) => {
  const {example, title, action, collapsed} = props;
  const classes = useStyles();
  // Methods for audios changed
  const handleAdd = (newAudio: AudioFileModel) => example.medias.push(newAudio);
  // Setting submitted
  const handleSettingChange = (settings: AudioExampleSettingsModel) => example.settings = settings;
  const addAdditionalQuestion = (question: SurveyControlModel) => example.fields.push(question);
  const deleteAdditionalQuestion = () => example.fields.pop();

  return <Card>
    <CardHeader title={title} action={<>
      <AudioExampleSettingsDialog settings={example.settings} onConfirm={handleSettingChange}/>
      {action} </>}/>
    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
      <CardContent style={{paddingTop: 0}}>
        <Grid container spacing={2}>
          <TestItemCardFileDropGrid example={example}/>
          {/*Description for this example*/}
          {example.fields && example.fields[0] && <Grid item xs={12}>
            <SurveyControl control={example.fields[0]}/>
          </Grid>}
          {/*Additional question add*/}
          {example.fields && !(example.fields.length > 1) ?
            <Grid item xs={12} className={classes.innerQuestionContainer}>
              <AddAdditionalQuestionButton onQuestionAdd={addAdditionalQuestion}/>
            </Grid> : <Grid item xs={12}>
              <div className={classes.innerQuestionContainer}>
                <FormControlLabel label="Required" control={
                  <Switch checked={example.fields[1].required}
                          onChange={e => example.fields[1].required = e.target.checked}/>}
                />
                <Tooltip title="Remove this question">
                  <IconButton onClick={deleteAdditionalQuestion}><Icon>clear</Icon></IconButton>
                </Tooltip>
              </div>
              <SurveyControl control={example.fields[1]}/>
            </Grid>}
          {/*Placeholder for adding to list*/}
          <Grid item xs={12} md={4}>
            <FileDropZone onChange={handleAdd} label="Drop or click to add a file"/>
          </Grid>
        </Grid>
      </CardContent>
    </Collapse>
  </Card>;
})
// A button can add additional questions for training example, including menu
const AddAdditionalQuestionButton = observer(function (props: { onQuestionAdd: (question: SurveyControlModel) => void }) {
  const {onQuestionAdd} = props;
  // When menu clicked
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleAddMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);

  const handleAdd = (type: SurveyControlType) => {
    // Close the adding menu
    setAnchorEl(null);
    // Check controls types
    switch (type) {
      case SurveyControlType.radio:
      case SurveyControlType.checkbox:
        onQuestionAdd({
          type: type,
          question: 'Untitled question',
          options: ['Add your options!'],
          value: null,
          required: true
        });
        break;
      case SurveyControlType.text:
        onQuestionAdd({type: type, question: 'Untitled question', value: null, required: true});
        break;
    }
  }

  return <>
    {/*Adding menu Button*/}
    <Button color="primary" onClick={handleAddMenuClick}><Icon>add</Icon> Ask a question</Button>
    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
      <MenuItem onClick={() => handleAdd(SurveyControlType.text)}>
        <ListItemIcon>
          <Icon fontSize="small">text_fields</Icon>
        </ListItemIcon>
        <ListItemText primary="Text Input"/>
      </MenuItem>
      <MenuItem onClick={() => handleAdd(SurveyControlType.radio)}>
        <ListItemIcon>
          <Icon fontSize="small">radio_button_checked</Icon>
        </ListItemIcon>
        <ListItemText primary="Radio Group"/>
      </MenuItem>
      <MenuItem onClick={() => handleAdd(SurveyControlType.checkbox)}>
        <ListItemIcon>
          <Icon fontSize="small">check_box</Icon>
        </ListItemIcon>
        <ListItemText primary="Checkbox Group"/>
      </MenuItem>
    </Menu>
  </>;
});
