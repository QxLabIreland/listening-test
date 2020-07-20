import {TestItemModel} from "../../shared/models/BasicTestModel";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import {SurveyControlType, TestItemType} from "../../shared/models/EnumsAndTypes";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {CardContent, FormControlLabel, Switch} from "@material-ui/core";
import {SurveyControl} from "../../shared/components/SurveyControl";
import React, {CSSProperties} from "react";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import {TagsGroup} from "../../shared/components/TagsGroup";
import Grid from "@material-ui/core/Grid";
import {FileDropZone} from "../../shared/components/FileDropZone";
import {ExampleSettingsDialog} from "../shared-views/ExampleSettingsDialog";
import {observer} from "mobx-react";

const labelInputStyle = {
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  outline: 'none',
  border: 'none',
  width: '100%'
} as CSSProperties;

export const AcrTestItemCard = observer(function (props: {
  value: TestItemModel,
  onDelete: () => void
}) {
  const {value, onDelete} = props;

  // Label methods
  const handleLabelChange = (event) => {
    value.title = event.target.value;
  }

  if (value.type === TestItemType.example || value.type === TestItemType.training) return (
    <TestItemExampleCard example={value.example} title={
      <input style={labelInputStyle} value={value.title} onChange={handleLabelChange}
             onFocus={event => event.target.select()}/>
    } delButton={
      <IconButton onClick={onDelete}><Icon>delete</Icon></IconButton>
    } isTraining={value.type === TestItemType.example}/>
  );

  else if (value.type === TestItemType.question) return <Card>
    <CardHeader style={{paddingBottom: 0}} action={<>
      {value.questionControl.type !== SurveyControlType.description && <FormControlLabel
        control={<Switch checked={value.questionControl.required} onChange={e => value.questionControl.required = e.target.checked}/>}
        label="Required"
      />}
      <IconButton onClick={onDelete}><Icon>delete</Icon></IconButton>
    </>} title={<input style={labelInputStyle} value={value.title} onChange={handleLabelChange}
                    onFocus={event => event.target.select()}/>}>
    </CardHeader>
    <CardContent>
      <SurveyControl control={value.questionControl}/>
    </CardContent>
  </Card>;
  else return null;
})

const TestItemExampleCard = observer((props: React.PropsWithChildren<{
  example: ItemExampleModel,
  delButton: React.ReactNode,
  title: React.ReactNode,
  isTraining?: boolean
}>) => {
  const {example, delButton, title, isTraining = true} = props;

  // Methods for audios changed
  const handleAdd = (newAudio: AudioFileModel) => example.audios.push(newAudio);

  const handleDelete = (index: number) => {
    if (index === -1) example.audioRef = undefined;
    else example.audios.splice(index, 1);
  }

  const handleChange = (newAudio: AudioFileModel, index: number) => {
    if (newAudio == null) {
      handleDelete(index);
      return;
    }
    // If is Reference the audioRef will be added or deleted
    if (index === -1) example.audioRef = newAudio;
    else example.audios[index] = newAudio;
  }

  // Setting submitted
  const handleSettingChange = (settings) => example.settings = settings;

  return <Card>
    <CardHeader style={{paddingBottom: 0}} title={title} action={
      <span>
        {delButton}
        <ExampleSettingsDialog settings={example.settings} onConfirm={handleSettingChange}/>
      </span>
    }/>
    <CardContent>
      <Grid container spacing={2}>
        {isTraining && <Grid item xs={12}>
          <TagsGroup value={example.tags} onChange={newTags => example.tags = newTags}/>
        </Grid>}

        {/*Description for this example*/}
        {example.fields?.map((q, qi) => <Grid item xs={12} key={qi}>
          <SurveyControl control={q}/>
        </Grid>)}

        {/*Reference place*/}
        {isTraining && <Grid item xs={12} md={4}>
          <FileDropZone fileModel={example.audioRef} onChange={fm => handleChange(fm, -1)}
                        label="Reference (Optional)"/>
        </Grid>}
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
