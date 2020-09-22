import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {SurveyControlType, TestItemType} from "../../shared/models/EnumsAndTypes";
import React, {ReactNode, useState} from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {
  Button,
  CardContent,
  Collapse,
  createStyles,
  FormControlLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Theme,
  Tooltip
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {SurveyControl} from "../../shared/components/SurveyControl";
import {ItemExampleSettingsModel} from "../../shared/models/ItemExampleModel";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import ExampleSettingsDialog from "../shared-views/ExampleSettingsDialog";
import Grid from "@material-ui/core/Grid";
import {FileDropZone} from "../../shared/components/FileDropZone";
import {labelInputStyle} from "../SharedStyles";
import {makeStyles} from "@material-ui/core/styles";
import {GotoQuestionItemModel, SurveyControlModel} from "../../shared/models/SurveyControlModel";
import {TestItemExampleCardProps, TestItemExampleCardType} from "./SomeTypes";
import {TestItemCardFileDropGrid} from "./TestItemCardFileDropGrid";

const useStyles = makeStyles((theme: Theme) => {
  const trans = theme.transitions.create('all', {duration: theme.transitions.duration.shortest});
  return createStyles({
    expand: {transform: 'rotate(0deg)', transition: trans},
    expandOpen: {transform: 'rotate(180deg)', transition: trans},
    innerQuestionContainer: {display: 'flex', justifyContent: 'flex-end'}
  });
});
/** To render item into different card based on type */
export const TestItemCard = observer(function (props: {
  value: TestItemModel, onDelete: () => void, TestItemExampleCard: TestItemExampleCardType,
  gotoQuestionItems?: GotoQuestionItemModel[], disableGoto?: boolean
}) {
  const {value, TestItemExampleCard} = props;
  // Label methods
  const handleLabelChange = (event: any) => {
    value.title = event.target.value;
  }

  // Switch to correct card
  const ExampleCard: TestItemExampleCardType = value.type === TestItemType.example ? TestItemExampleCard : TestItemTrainingCard;
  if (value.type === TestItemType.example || value.type === TestItemType.training) return <ExampleCard
    title={<input style={labelInputStyle} onFocus={event => event.target.select()}
                  value={value.title} onChange={handleLabelChange}/>}
    example={value.example} collapsed={value.collapsed} action={<HeaderIconButtons {...props}/>}
  />

  else if (value.type === TestItemType.question)
    return <TestItemQuestionCard {...props} action={<HeaderIconButtons {...props}/>} collapsed={value.collapsed}/>

  else return null;
})
// Buttons group for common operations
const HeaderIconButtons = observer(function ({onDelete, value}: { value: TestItemModel, onDelete: () => void }) {
  const classes = useStyles();
  return <>
    <Tooltip title={`${value.collapsed ? 'Expand' : 'Collapse'} Question`}>
      <IconButton className={value.collapsed ? classes.expand : classes.expandOpen}
                  onClick={() => value.collapsed = !value.collapsed}>
        <Icon>{value.collapsed ? 'unfold_more' : 'unfold_less'}</Icon>
      </IconButton>
    </Tooltip>
    <Tooltip title="Delete Question">
      <IconButton onClick={onDelete}><Icon>delete</Icon></IconButton>
    </Tooltip>
  </>
})
/** Question Card for survey questions*/
const TestItemQuestionCard = observer(function ({value, action, collapsed, gotoQuestionItems, disableGoto}: {
  value: TestItemModel, action: ReactNode, collapsed?: boolean,
  gotoQuestionItems?: GotoQuestionItemModel[], disableGoto?: boolean
}) {
  // If the index is at end of list, the goto feature will be delete
  const gotoQuestionItemsFiltered = gotoQuestionItems.findIndex(cur => cur.id === value.id) >= gotoQuestionItems.length - 1
    ? undefined : gotoQuestionItems.filter(cur => cur.id !== value.id);
  return <Card>
    <CardHeader action={<>
      {value.questionControl.type !== SurveyControlType.description && <FormControlLabel label="Required" control={
        <Switch checked={value.questionControl.required}
                onChange={e => value.questionControl.required = e.target.checked}/>}
      />} {action}
    </>} title={<input style={labelInputStyle} value={value.title} onChange={e => value.title = e.target.value}
                       onFocus={event => event.target.select()}/>}>
    </CardHeader>
    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
      <CardContent style={{paddingTop: 0}}>
        <SurveyControl control={value.questionControl} disableGoto={disableGoto}
          // Filter current item out of list
                       gotoQuestionItems={gotoQuestionItemsFiltered}/>
      </CardContent>
    </Collapse>
  </Card>
})
/** Training Test Item: Audios will play synchronously*/
const TestItemTrainingCard = observer((props: React.PropsWithChildren<TestItemExampleCardProps>) => {
  const {example, title, action, collapsed} = props;
  const classes = useStyles();
  // Methods for audios changed
  const handleAdd = (newAudio: AudioFileModel) => example.audios.push(newAudio);
  // Setting submitted
  const handleSettingChange = (settings: ItemExampleSettingsModel) => example.settings = settings;
  const addAdditionalQuestion = (question: SurveyControlModel) => example.fields.push(question);
  const deleteAdditionalQuestion = () => example.fields.pop();

  return <Card>
    <CardHeader title={title} action={<>
      <ExampleSettingsDialog settings={example.settings} onConfirm={handleSettingChange}/>
      {action} </>}/>
    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
      <CardContent style={{paddingTop: 0}}>
        <Grid container spacing={2}>
          {/*Description for this example*/}
          {example.fields && example.fields[0] && <Grid item xs={12}>
            <SurveyControl control={example.fields[0]}/>
          </Grid>}
          {/*Additional question add*/}
          {example.fields && !(example.fields.length > 1) ?
            <Grid item xs={12} className={classes.innerQuestionContainer}>
              <AddAdditionalQuestionButton onQuestionAdd={addAdditionalQuestion}/>
            </Grid> : <Grid item xs={12} container>
              <Grid xs><SurveyControl control={example.fields[1]}/></Grid>
              <Grid><Tooltip title="Remove this question">
                <IconButton onClick={deleteAdditionalQuestion}><Icon>remove</Icon></IconButton>
              </Tooltip></Grid>
            </Grid>}

          <TestItemCardFileDropGrid example={example}/>
          {/*Placeholder for adding to list*/}
          <Grid item xs={12} md={4}>
            <FileDropZone onChange={handleAdd} label="Drop or click to add a file"/>
          </Grid>
        </Grid>
      </CardContent>
    </Collapse>
    {/*<CardActions style={{justifyContent: 'flex-end', paddingTop: 0}}>
    </CardActions>*/}
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
    <Button color="primary" onClick={handleAddMenuClick}>
      Ask a question</Button>
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
