import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import {CardContent, Collapse, Slider, TextField, Tooltip} from "@material-ui/core";
import {SurveyControl} from "../../../shared/components/SurveyControl";
import React, {ReactNode, useEffect, useState} from "react";
import {TagsGroup} from "../../../shared/components/TagsGroup";
import Grid from "@material-ui/core/Grid";
import {observer} from "mobx-react";
import {createOscillatorAndGain, disposeOscillatorAndGain} from "../../../shared/web-audio/OscillatorAngGain";
import {AudioExampleModel, AudioFileModel} from "../../../shared/models/AudioTestModel";

export const HearingTestItemExampleCard = observer((props: React.PropsWithChildren<{
  example: AudioExampleModel, title: ReactNode, action: ReactNode, collapsed?: boolean
}>) => {
  const {example, title, action, collapsed} = props;

  return <Card>
    <CardHeader title={title} action={action}/>
    <Collapse in={!collapsed} timeout="auto" unmountOnExit>
      <CardContent style={{paddingTop: 0}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TagsGroup value={example.tags} onChange={newTags => example.tags = newTags}/>
          </Grid>
          {/*Description for this example*/}
          {example.fields?.map((q, qi) => <Grid item xs={12} key={qi}>
            <SurveyControl control={q}/>
          </Grid>)}

          {/*Audios*/}
          {example.medias.map((a, i) => <Grid key={i} item xs={12} md={12}>
            <AudioSettingsView audio={a}/>
          </Grid>)}

        </Grid>
      </CardContent>
    </Collapse>
  </Card>;
})

const AudioSettingsView = observer(function ({audio}: { audio: AudioFileModel }) {
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
