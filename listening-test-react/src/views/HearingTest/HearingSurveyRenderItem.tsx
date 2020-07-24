import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {TestItemType} from "../../shared/models/EnumsAndTypes";
import {RenderSurveyControl} from "../../shared/components/RenderSurveyControl";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import Grid from "@material-ui/core/Grid";
import {Box, Slider, Tooltip} from "@material-ui/core";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";

export const HearingSurveyRenderItem = observer(function (props: { item: TestItemModel, active?: boolean }) {
  const {item, ...rest} = props;
  switch (item.type) {
    case TestItemType.question:
      return <RenderSurveyControl control={item.questionControl} {...rest}/>
    case TestItemType.example:
      return <RenderVolumeExample value={item.example} {...rest}/>;
    default:
      return null;
  }
})

// Make sure it works on safari and firefox. And create only one for the application
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext) ();

interface GainAndOscillator {
  oscillator: OscillatorNode;
  gainNode: GainNode;
}

function createOscillatorAndGain(volume: number, frequency: number): GainAndOscillator {
  // Create oscillator and gain nodes
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  // Calculate gain volume db
  const gainDb = (volume - 1) * 100;
  gainNode.gain.value = Math.pow(10, gainDb / 20);
  // Change default frequency
  oscillator.frequency.value = frequency;
  // Connect gainNode and oscillator
  gainNode.connect(audioContext.destination);
  oscillator.connect(gainNode);
  return {oscillator, gainNode};
}

function disposeGo(go: GainAndOscillator) {
  if (go?.oscillator) {
    go.oscillator.stop();
    go.oscillator.disconnect();
  }
  if (go?.gainNode) go.gainNode.disconnect();
  return null;
}

const RenderVolumeExample = observer(function (props: { value: ItemExampleModel, active?: boolean }) {
  const {value, active} = props;
  const [gos] = useState<GainAndOscillator[]>(Array(value.audios.length));

  useEffect(() => {
    // if (active === false) onPause();
  }, [active]);

  const handleButtonClick = (audio: AudioFileModel, index: number) => {
    if (audio.isPlaying) {
      gos[index] = disposeGo(gos[index]);
      audio.isPlaying = false;
    }
    else {
      // Stop others first
      gos.forEach((v, i) => {
        if (i === index || !v?.oscillator) return;
        gos[i] = disposeGo(v);
        props.value.audios[i].isPlaying = false;
      })
      // Create a Oscillator and Gain object
      gos[index] = createOscillatorAndGain(audio.value? +audio.value : audio.settings.initVolume, audio.settings.frequency);
      gos[index].oscillator.start();
      audio.isPlaying = true;
    }
  }

  return <Grid container spacing={3}>
    {value.fields?.map((value, i) => <Grid item xs={12} key={i}>
      <RenderSurveyControl control={value}/>
    </Grid>)}

    {value.audios.map((v, i) => <Grid item key={i} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end'
    }}>
      <GainNodeBar audio={v} gainNode={gos[i]?.gainNode}/>
      <Button variant={v.isPlaying ? 'contained' : 'outlined'} color="primary" size="large" disableElevation
              style={{transition: 'none'}}
        // disabled={playedTimes >= settings?.loopTimes}
              onClick={() => handleButtonClick(v, i)}>
        <Icon>{v.isPlaying ? 'pause' : 'play_arrow'}</Icon>
      </Button>
    </Grid>)}

  </Grid>
})

const GainNodeBar = observer(function (props: { audio: AudioFileModel, gainNode: GainNode }) {
  const handleSliderChange = (_, nv: number | number[]) => {
    props.audio.value = (+nv).toString();
    if (!props.gainNode) return;
    const gainDb = (+nv - 1) * 100;
    props.gainNode.gain.value = Math.pow(10, gainDb / 20);
  }

  return <>
    <div style={{height: 24}}>
      {!!Number(props.audio.value) ? <Tooltip title="Done!"><Icon>check</Icon></Tooltip>
      : <Tooltip title="Please drag sliders"><Icon style={{color: '#cccccc'}}>check</Icon></Tooltip>}
    </div>
    <Box mb={2} mt={2} style={{height: 200}}>
    {/*<Grid container spacing={1} direction="column" justify="space-between">
      <Grid item><Icon>volume_down</Icon></Grid>
      <Grid item>

      </Grid>
      <Grid item><Icon>volume_up</Icon></Grid>
    </Grid>*/}
    <Slider orientation="vertical" aria-labelledby="vertical-slider" min={0} max={1} step={0.01} valueLabelDisplay="auto"
            defaultValue={Number(props.audio.value)  ? +props.audio.value : props.audio.settings?.initVolume}
            onChange={handleSliderChange}/>

  </Box></>
})
