import {TestItemModel} from "../../shared/models/BasicTestModel";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import {TestItemType} from "../../shared/models/EnumsAndTypes";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {Box, CardContent, Slider, TextField, Typography} from "@material-ui/core";
import {SurveyControl} from "../../shared/components/SurveyControl";
import React from "react";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import {TagsGroup} from "../../shared/components/TagsGroup";
import Grid from "@material-ui/core/Grid";
import {FileDropZone} from "../../shared/components/FileDropZone";
import {ExampleSettingsDialog} from "../shared-views/ExampleSettingsDialog";
import {observer} from "mobx-react";
import {labelInputStyle, TestItemQuestionCard} from "../components/TestItemQuestionCard";

export const HearingTestItemCard = observer(function (props: { value: TestItemModel, onDelete: () => void }) {
  const {value, onDelete} = props;

  // Label methods
  const handleLabelChange = (event) => {
    value.title = event.target.value;
  }

  if (value.type === TestItemType.example) return <TestItemExampleCard title={
    <input style={labelInputStyle} value={value.title} onChange={handleLabelChange}
           onFocus={event => event.target.select()}/>
  } example={value.example} onDelete={onDelete}/>

  else if (value.type === TestItemType.question) return <TestItemQuestionCard {...props}/>

  else return null;
})

const TestItemExampleCard = observer((props: React.PropsWithChildren<{ example: ItemExampleModel, onDelete: () => void, title: React.ReactNode }>) => {
  const {example, onDelete, title} = props;

  // Methods for audios changed
  const handleAdd = (newAudio: AudioFileModel) => {
    // Add settings for newAudio
    newAudio.settings = {initVolume: 1, frequency: null};
    example.audios.push(newAudio);
  }

  const handleChange = (newAudio: AudioFileModel, index: number) => {
    if (newAudio == null) {
      handleDelete(index);
      return;
    }
    // Add settings for newAudio
    newAudio.settings = {initVolume: 1, frequency: null};
    // If is Reference the audioRef will be added or deleted
    if (index === -1) example.audioRef = newAudio;
    else example.audios[index] = newAudio;
  }

  const handleDelete = (index: number) => {
    if (index === -1) example.audioRef = undefined;
    else example.audios.splice(index, 1);
  }

  // Setting submitted
  const handleSettingChange = (settings) => example.settings = settings;

  return <Card>
    <CardHeader style={{paddingBottom: 0}} title={title} action={
      <span>
        <IconButton onClick={onDelete}><Icon>delete</Icon></IconButton>
        <ExampleSettingsDialog settings={example.settings} onConfirm={handleSettingChange}/>
      </span>
    }/>
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TagsGroup value={example.tags} onChange={newTags => example.tags = newTags}/>
        </Grid>

        {/*Description for this example*/}
        {example.fields?.map((q, qi) => <Grid item xs={12} key={qi}>
          <SurveyControl control={q}/>
        </Grid>)}

        {/*Reference place*/}
        <Grid item xs={12} md={4}>
          <FileDropZone fileModel={example.audioRef} onChange={fm => handleChange(fm, -1)}
                        label="Reference (Optional)"/>
        </Grid>
        {/*Audios*/}
        {example.audios.map((a, i) => <Grid key={i} item xs={12} md={4}>
          <FileDropZone fileModel={a} onChange={fm => handleChange(fm, i)}/>
          <Box mt={2}>
            <AudioSettingsView audio={a}/>
          </Box>
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

const AudioSettingsView = observer(function ({audio}: { audio: AudioFileModel }) {
  // Performance boost with defaultValue
  const FrequencyText = () => <TextField variant="outlined" size="small" label="Frequency in Hz" fullWidth
                                         defaultValue={audio.settings.frequency}
                                         onChange={e => audio.settings.frequency = e.target.value}/>

  return <Grid container spacing={1}>
    <Grid item xs={12}>
      <FrequencyText/>
    </Grid>
    <Grid item xs={12}><Typography variant="body2" gutterBottom>Initial Volume:</Typography></Grid>
    <Grid item><Icon>volume_down</Icon></Grid>
    <Grid item xs>
      <Slider value={audio.settings.initVolume} step={0.01} min={0} max={1} valueLabelDisplay="auto"
              onChange={(e, nv) => audio.settings.initVolume = +nv}
              aria-labelledby="continuous-slider"/>
    </Grid>
    <Grid item><Icon>volume_up</Icon></Grid>
  </Grid>
})
