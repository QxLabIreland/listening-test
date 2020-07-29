import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {TestItemType} from "../../shared/models/EnumsAndTypes";
import {RenderSurveyControl} from "../../shared/components/RenderSurveyControl";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import Grid from "@material-ui/core/Grid";
import {Box, Slider} from "@material-ui/core";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import {RenderSurveyTraining} from "../components/RenderSurveyTraining";
import {
  createOscillatorAndGain,
  disposeOscillatorAndGain,
  OscillatorAngGain
} from "../../shared/web-audio/OscillatorAngGain";
import {ratingAreaStyle} from "../SharedStyles";

export const HearingSurveyRenderItem = observer(function (props: { item: TestItemModel, active?: boolean }) {
  const {item, ...rest} = props;
  switch (item.type) {
    case TestItemType.question:
      return <RenderSurveyControl control={item.questionControl} {...rest}/>
    case TestItemType.example:
      return <RenderVolumeExample value={item.example} {...rest}/>;
    case TestItemType.training:
      return <RenderSurveyTraining value={item.example} disableSlider {...rest}/>;
    default:
      return null;
  }
})

const RenderVolumeExample = observer(function (props: { value: ItemExampleModel, active?: boolean }) {
  const {value, active} = props;
  const [gos] = useState<OscillatorAngGain[]>(Array(value.audios.length));

  useEffect(() => {
    gos.forEach(go => disposeOscillatorAndGain(go))
  }, [active]);

  const handleButtonClick = (audio: AudioFileModel, index: number) => {
    if (audio.isPlaying) {
      gos[index] = disposeOscillatorAndGain(gos[index]);
      audio.isPlaying = false;
    }
    else {
      // Stop others first
      gos.forEach((v, i) => {
        if (i === index || !v?.oscillator) return;
        gos[i] = disposeOscillatorAndGain(v);
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

    {value.audios.map((v, i) => <Grid item key={i} style={ratingAreaStyle}>
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
  const handleSliderChange = (_: any, nv: number | number[]) => {
    props.audio.value = (+nv).toString();
    if (!props.gainNode) return;
    const gainDb = (+nv - 1) * 100;
    props.gainNode.gain.value = Math.pow(10, gainDb / 20);
  }

  return <>
    <Box mb={2} mt={2} style={{height: 200}}>
    {/*<Grid container spacing={1} direction="column" justify="space-between">
      <Grid item><Icon>volume_down</Icon></Grid>
      <Grid item>

      </Grid>
      <Grid item><Icon>volume_up</Icon></Grid>
    </Grid>*/}
    <Slider orientation="vertical" aria-labelledby="vertical-slider" min={0} max={1} step={0.01}
            defaultValue={Number(props.audio.value)  ? +props.audio.value : props.audio.settings?.initVolume}
            onChange={handleSliderChange}/>

  </Box></>
})
