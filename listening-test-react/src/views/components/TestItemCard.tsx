import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {SurveyControlType, TestItemType} from "../../shared/models/EnumsAndTypes";
import React, {FunctionComponent, ReactNode} from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {CardContent, Collapse, createStyles, FormControlLabel, Switch, Theme, Tooltip} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {SurveyControl} from "../../shared/components/SurveyControl";
import {ItemExampleModel, ItemExampleSettingsModel} from "../../shared/models/ItemExampleModel";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import ExampleSettingsDialog from "../shared-views/ExampleSettingsDialog";
import Grid from "@material-ui/core/Grid";
import {FileDropZone} from "../../shared/components/FileDropZone";
import {labelInputStyle} from "../SharedStyles";
import {makeStyles} from "@material-ui/core/styles";

export const TestItemCard = observer(function (props: {
  value: TestItemModel, onDelete: () => void, TestItemExampleCard: FunctionComponent<{
    example: ItemExampleModel, title: ReactNode, action: ReactNode, collapsed?: boolean
  }>
}) {
  const {value, TestItemExampleCard} = props;
  // Label methods
  const handleLabelChange = (event: any) => {
    value.title = event.target.value;
  }

  const ExampleCard = value.type === TestItemType.example ? TestItemExampleCard : TestItemTrainingCard;

  // Switch to correct card
  if (value.type === TestItemType.example || value.type === TestItemType.training) return <ExampleCard title={
    <input style={labelInputStyle} onFocus={event => event.target.select()}
           value={value.title} onChange={handleLabelChange}/>
  } example={value.example} collapsed={value.collapsed} action={<HeaderIconButtons {...props}/>}/>

  else if (value.type === TestItemType.question)
    return <TestItemQuestionCard {...props} action={<HeaderIconButtons {...props}/>} collapsed={value.collapsed}/>

  else return null;
})

const useStyles = makeStyles((theme: Theme) => {
  const trans = theme.transitions.create('all', {duration: theme.transitions.duration.shortest});
  return createStyles({
    expand: {transform: 'rotate(0deg)', transition: trans},
    expandOpen: {transform: 'rotate(180deg)', transition: trans},
  });
});

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

const TestItemQuestionCard = observer(function ({value, action, collapsed}: { value: TestItemModel, action: ReactNode, collapsed?: boolean }) {
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
        <SurveyControl control={value.questionControl}/>
      </CardContent>
    </Collapse>
  </Card>
})

const TestItemTrainingCard = observer((props: React.PropsWithChildren<{
  example: ItemExampleModel, title: ReactNode, action: ReactNode, collapsed?: boolean
}>) => {
  const {example, title, action, collapsed} = props;

  // Methods for audios changed
  const handleAdd = (newAudio: AudioFileModel) => example.audios.push(newAudio);

  const handleDelete = (index: number) => example.audios.splice(index, 1);

  const handleChange = (newAudio: AudioFileModel, index: number) => {
    if (newAudio == null) {
      handleDelete(index);
      return;
    }
    example.audios[index] = newAudio;
  }

  // Setting submitted
  const handleSettingChange = (settings: ItemExampleSettingsModel) => example.settings = settings;

  return <Card>
    <CardHeader title={title} action={<>
      <ExampleSettingsDialog settings={example.settings} onConfirm={handleSettingChange}/>
      {action} </>}/>
    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
      <CardContent style={{paddingTop: 0}}>
        <Grid container spacing={2}>
          {/*Description for this example*/}
          {example.fields?.map((q, qi) => <Grid item xs={12} key={qi}>
            <SurveyControl control={q}/>
          </Grid>)}

          {example.audios.map((a, i) => <Grid item xs={12} md={4} key={i}>
            <FileDropZone fileModel={a} onChange={fm => handleChange(fm, i)}/>
          </Grid>)}

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
