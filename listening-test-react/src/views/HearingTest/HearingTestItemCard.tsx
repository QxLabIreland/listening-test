import {TestItemModel} from "../../shared/models/BasicTestModel";
import {ItemExampleModel, ItemExampleSettingsModel} from "../../shared/models/ItemExampleModel";
import {TestItemType} from "../../shared/models/EnumsAndTypes";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {CardContent, Slider, TextField, Tooltip} from "@material-ui/core";
import {SurveyControl} from "../../shared/components/SurveyControl";
import React, {useEffect, useState} from "react";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import {TagsGroup} from "../../shared/components/TagsGroup";
import Grid from "@material-ui/core/Grid";
import ExampleSettingsDialog from "../shared-views/ExampleSettingsDialog";
import {observer} from "mobx-react";
import {labelInputStyle, TestItemQuestionCard} from "../components/TestItemQuestionCard";
import {TestItemTrainingCard} from "../components/TestItemTrainingCard";
import {createOscillatorAndGain, disposeOscillatorAndGain} from "../../shared/web-audio/OscillatorAngGain";

export const HearingTestItemCard = observer(function (props: { value: TestItemModel, onDelete: () => void }) {
  const {value, onDelete} = props;

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

const TestItemExampleCard = observer((props: React.PropsWithChildren<{ example: ItemExampleModel, onDelete: () => void, title: React.ReactNode }>) => {
  const {example, onDelete, title} = props;

  // Setting submitted
  const handleExampleSettingChange = (settings: ItemExampleSettingsModel) => example.settings = settings;

  return <Card>
    <CardHeader style={{paddingBottom: 0}} title={title} action={
      <span>
        <IconButton onClick={onDelete}><Icon>delete</Icon></IconButton>
        <ExampleSettingsDialog settings={example.settings} onConfirm={handleExampleSettingChange}/>
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

        {/*Audios*/}
        {example.audios.map((a, i) => <Grid key={i} item xs={12} md={12}>
          <AudioSettingsView audio={a}/>
        </Grid>)}

      </Grid>
    </CardContent>
    {/*<CardActions style={{justifyContent: 'flex-end', paddingTop: 0}}>
    </CardActions>*/}
  </Card>;
})

const AudioSettingsView = observer(function ({audio}: { audio: AudioFileModel}) {
  // Go means Gain and Oscillator
  const [go, setGo] = useState(null);

  // Make sure go will be disposed
  useEffect(() => () => disposeOscillatorAndGain(go), [go]);

  // Create oscillator for testing
  const handlePlay = () => {
    if (go) {
      setGo(disposeOscillatorAndGain(go));
      return;
    }
    const newGos = createOscillatorAndGain(audio.settings.initVolume, audio.settings.frequency);
    newGos.oscillator.start();
    setGo(newGos);
  }

  // When frequency changed, the oscillator will be stopped
  const handleFrequencyChange = (event: any) => {
    audio.settings.frequency = +event.target.value;
    if (go) setGo(disposeOscillatorAndGain(go));
  }

  // When volume changed, the oscillator sound volume changed
  const handleSliderChange = (_: any, nv: number | number[]) => {
    audio.settings.initVolume = +nv;
    if (!go?.gainNode) return;
    go.gainNode.gain.value = Math.pow(10, (+nv - 1) * 100 / 20);
  }

  return <Grid container spacing={1} alignItems="center">
    <Grid item>
      <Tooltip title={go == null ? 'Play ocsillator' : 'Stop'}>
        <IconButton onClick={handlePlay} size="small"><Icon>{go == null ? 'play_arrow' : 'pause'}</Icon></IconButton>
      </Tooltip>
    </Grid>
    <Grid item xs>
      <TextField variant="outlined" size="small" label="Frequency in Hz" fullWidth type="number"
                 defaultValue={audio.settings.frequency} required
                 onChange={handleFrequencyChange}/>
    </Grid>

    {/*<Grid item>
      <Typography variant="body2" gutterBottom>Initial Volume:</Typography>
    </Grid>*/}

    <Grid item><Icon>volume_down</Icon></Grid>
    <Grid item xs>
      Initial Volume:
      <Slider value={audio.settings.initVolume} step={0.01} min={0} max={1} valueLabelDisplay="auto"
              onChange={handleSliderChange}
              aria-labelledby="continuous-slider"/>
    </Grid>
    <Grid item><Icon>volume_up</Icon></Grid>
  </Grid>
})
