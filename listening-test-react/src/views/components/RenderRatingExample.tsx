import {observer} from "mobx-react";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import {AudioButton, AudioController, useAudioPlayer} from "../../shared/web-audio/AudiosPlayer";
import {AudioLoading, useAllAudioReady} from "../../shared/web-audio/AudiosLoading";
import React, {forwardRef, RefObject, useEffect, useImperativeHandle, useRef, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {RenderSurveyControl} from "../../shared/components/RenderSurveyControl";
import {ratingAreaStyle} from "../SharedStyles";
import {Box, createStyles, Slider, Theme, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export const RenderRatingExample = observer(function (props: { value: ItemExampleModel, RatingBar: (props: { audio: AudioFileModel }) => JSX.Element, active?: boolean }) {
  const {value, RatingBar, active} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, handleTimeUpdate, handlePlay, handlePause} = useAudioPlayer(value.audios, value.audioRef);
  const allRefs = value.audioRef ? [...refs, sampleRef] : refs;
  const loading = useAllAudioReady(allRefs);
  // An event for setting Time update method
  const [onTimeUpdate, setOnTimeUpdate] = useState<() => void>();
  useEffect(() => {
    if (active === false) handlePause();
  }, [active]);

  return <> <AudioLoading showing={loading}/>
    <Grid container spacing={3} style={{display: loading ? 'none' : 'flex'}}>
      {value.fields?.map((value, i) => <Grid item xs={12} key={i}>
        <RenderSurveyControl control={value}/>
      </Grid>)}

      {value.audios.map((v, i) => <Grid item key={i} style={ratingAreaStyle}>
        <RatingBar audio={v}/>
        <AudioButton ref={refs[i]} audio={v} onPlay={handlePlay} onPause={handlePause} settings={value.settings}
                     onTimeUpdate={i === 0 ? onTimeUpdate ? onTimeUpdate : handleTimeUpdate : undefined}>{i + 1}</AudioButton>
        {/*{isDevMode() && <span>{refs[i].current?.currentTime}</span>}*/}
      </Grid>)}

      {/*Reference*/}
      {value.audioRef && <Grid item style={ratingAreaStyle}>
        <AudioButton ref={sampleRef} audio={value.audioRef} onPlay={handlePlay} onPause={handlePause}>Ref</AudioButton>
        {/*{isDevMode() && <span>{sampleRef?.current?.currentTime}</span>}*/}
      </Grid>}

      <Grid item xs={12}>
        <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}/>
        {value.settings?.sectionLooping && <AudioSectionLoopingController setTimeUpdate={f => setOnTimeUpdate(f)} refs={allRefs} currentTime={currentTime}/>}
      </Grid>
    </Grid>
  </>
})

const useStyles = makeStyles((_: Theme) => createStyles({
  valueLabel: {top: 22, '& *': {background: 'transparent', color: '#000'}},
  thumb: {zIndex: 1},
  barContainer: {position: 'relative'},
  barCover: {position: 'absolute', top: -20, height: 2, display: 'block', background: '#b7bde3'}
}));
const AudioSectionLoopingController = function ({refs, currentTime, setTimeUpdate}: { refs: RefObject<HTMLAudioElement> [], currentTime: number, setTimeUpdate: (_: () => void) => void}) {
  const primary = refs[0];
  const [range, setRange] = useState([0, 0]);
  const classes = useStyles();
  useEffect(() => {
    // Make sure it has value and set range
    if (primary?.current?.duration) {
      const newValue = [0, primary.current?.duration];
      setRange(newValue);
    }
  }, [primary.current]);
  // Return update methods for parent component
  useEffect(() => setTimeUpdate(() => {
    if (currentTime < range[0] || currentTime > range[1])
      refs.forEach(value1 => value1.current.currentTime = range[0])
  }));

  // When drag the slider bar
  const handleChange = (_: any, newValue: number | number[]) => {
    const newRanges = newValue as number[]
    // If the current time is out of range
    if (currentTime < newRanges[0] || currentTime > newRanges[1])
      refs.forEach(value1 => value1.current.currentTime = newRanges[0])
    setRange(newRanges);
  }
  const handleSliderLabelFormat = (num: number) => {
    return isNaN(num) ? 0 : num.toFixed(0) + 's'
  }
  // Calculate cover bar of styles every rendering
  const barCoverStyle = {
    left: 0, width: range[0] / refs[0].current?.duration * 100 + '%'
  };

  return <Box className={classes.barContainer}>
    <Typography>Section Looping Controls</Typography>
    <Slider classes={{thumb: classes.thumb, valueLabel: classes.valueLabel}} valueLabelDisplay="auto"
            value={range} aria-labelledby="range-slider" step={0.1} max={refs[0].current?.duration}
            valueLabelFormat={handleSliderLabelFormat} onChange={handleChange}/>
    <span className={classes.barCover} style={barCoverStyle}/>
  </Box>
}
