import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {SurveyControlType, TestItemType} from "../../shared/models/EnumsAndTypes";
import React, {FunctionComponent} from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {CardContent, FormControlLabel, Switch} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {SurveyControl} from "../../shared/components/SurveyControl";
import {ItemExampleModel, ItemExampleSettingsModel} from "../../shared/models/ItemExampleModel";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import ExampleSettingsDialog from "../shared-views/ExampleSettingsDialog";
import Grid from "@material-ui/core/Grid";
import {FileDropZone} from "../../shared/components/FileDropZone";
import {labelInputStyle} from "../SharedStyles";

export const TestItemCard = observer(function (props: { value: TestItemModel, onDelete: () => void,
  TestItemExampleCard: FunctionComponent<{example: ItemExampleModel, onDelete: () => void, title: React.ReactNode}> }) {
  const {value, onDelete, TestItemExampleCard} = props;

  // Label methods
  const handleLabelChange = (event: any) => {
    value.title = event.target.value;
  }

  // Switch to correct card
  if (value.type === TestItemType.example) return <TestItemExampleCard title={
    <input style={labelInputStyle} value={value.title} onChange={handleLabelChange}
           onFocus={event => event.target.select()}/>
  } example={value.example} onDelete={onDelete}/>

  else if (value.type === TestItemType.question) return <TestItemQuestionCard {...props}/>

  else if (value.type === TestItemType.training) return <TestItemTrainingCard title={
    <input style={labelInputStyle} value={value.title} onChange={handleLabelChange}
           onFocus={event => event.target.select()}/>
  } example={value.example} onDelete={onDelete}/>

  else return null;
})

export const TestItemQuestionCard = observer(function ({value, onDelete}: { value: TestItemModel, onDelete: () => void }) {
  return <Card>
    <CardHeader style={{paddingBottom: 0}} action={<>
      {value.questionControl.type !== SurveyControlType.description && <FormControlLabel label="Required" control={
        <Switch checked={value.questionControl.required}
                onChange={e => value.questionControl.required = e.target.checked}/>}
      />}
      <IconButton onClick={onDelete}><Icon>delete</Icon></IconButton>
    </>} title={<input style={labelInputStyle} value={value.title} onChange={e => value.title = e.target.value}
                       onFocus={event => event.target.select()}/>}>
    </CardHeader>
    <CardContent>
      <SurveyControl control={value.questionControl}/>
    </CardContent>
  </Card>
})

export const TestItemTrainingCard = observer((props: React.PropsWithChildren<{
  example: ItemExampleModel,
  title: React.ReactNode,
  onDelete: () => void
}>) => {
  const {example, onDelete, title} = props;

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
    <CardHeader style={{paddingBottom: 0}} title={title} action={
      <span>
        <IconButton onClick={onDelete}><Icon>delete</Icon></IconButton>
        <ExampleSettingsDialog settings={example.settings} onConfirm={handleSettingChange}/>
      </span>
    }/>
    <CardContent>
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
    {/*<CardActions style={{justifyContent: 'flex-end', paddingTop: 0}}>
    </CardActions>*/}
  </Card>;
})
