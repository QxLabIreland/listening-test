import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {AudioExampleModel, AudioFileModel} from "../../../shared/models/AudioTestModel";
import {SurveyControlRender} from "../../forms/SurveyControl.render";
import Grid from "@material-ui/core/Grid";
import {createStyles, Slider, Theme} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import {
  createOscillatorAndGain,
  disposeOscillatorAndGain,
  OscillatorAngGain
} from "./OscillatorAngGain";
import {ratingAreaStyle} from "../../../shared/SharedStyles";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({
  volumeBarContainer: {margin: `${theme.spacing(2)}px 0`},
  volumeBar: {minHeight: theme.spacing(16)}
}));

export const HearingTestItemExampleRender = observer(function (props: { value: AudioExampleModel, active?: boolean }) {
  const {value, active} = props;
  const [gos] = useState<OscillatorAngGain[]>(Array(value.medias.length));

  useEffect(() => {
    gos.forEach(go => disposeOscillatorAndGain(go))
  }, [active]);

  const handleButtonClick = (audio: AudioFileModel, index: number) => {
    if (audio.isActive) {
      gos[index] = disposeOscillatorAndGain(gos[index]);
      audio.isActive = false;
    }
    else {
      // value.playedOnce = true;
      // Stop others first
      gos.forEach((v, i) => {
        if (i === index || !v?.oscillator) return;
        gos[i] = disposeOscillatorAndGain(v);
        props.value.medias[i].isActive = false;
      })
      // Create a Oscillator and Gain object
      gos[index] = createOscillatorAndGain(audio.value? +audio.value : audio.settings.initVolume, audio.settings.frequency);
      gos[index].oscillator.start();
      audio.isActive = true;
    }
  }

  return <Grid container spacing={2}>
    {value.fields?.map((value, i) => <Grid item xs={12} key={i}>
      <SurveyControlRender control={value}/>
    </Grid>)}

    {value.medias.map((v, i) => <Grid item key={i} style={ratingAreaStyle}>
      <VolumeBar audio={v} gainNode={gos[i]?.gainNode}/>
      <Button variant={v.isActive ? 'contained' : 'outlined'} color="primary" size="large" disableElevation
              style={{transition: 'none'}}
        // disabled={playedTimes >= settings?.loopTimes}
              onClick={() => handleButtonClick(v, i)}>
        <Icon>{v.isActive ? 'pause' : 'play_arrow'}</Icon>
      </Button>
    </Grid>)}

  </Grid>
})

const VolumeBar = observer(function ({audio, gainNode}: { audio: AudioFileModel, gainNode: GainNode }) {
  const classes = useStyles();

  const handleSliderChange = (_: any, nv: number | number[]) => {
    audio.value = (+nv).toString();
    if (!gainNode) return;
    const gainDb = (+nv - 1) * 100;
    gainNode.gain.value = Math.pow(10, gainDb / 20);
  }

  if (!Number(audio.value) && audio.value !== '0') audio.value = audio.settings?.initVolume.toString();

  return <Grid container spacing={1} direction="column" alignItems="center" className={classes.volumeBarContainer}>
    <Grid item><Icon>volume_up</Icon></Grid>
    <Grid item xs className={classes.volumeBar}>
      <Slider orientation="vertical" aria-labelledby="vertical-slider" min={0} max={1} step={0.01}
              value={+audio.value} onChange={handleSliderChange}/>
    </Grid>
    <Grid item><Icon>volume_down</Icon></Grid>
  </Grid>
})
