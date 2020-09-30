import {makeStyles, Theme} from "@material-ui/core/styles";
import {Box, createStyles, Typography} from "@material-ui/core";
import React, {RefObject, useEffect, useState} from "react";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles((_: Theme) => createStyles({
  valueLabel: {top: 22, '& *': {background: 'transparent', color: '#000'}},
  thumb: {zIndex: 1},
  barContainer: {position: 'relative'},
  barCover: {position: 'absolute', top: -20, height: 2, display: 'block', background: '#b7bde3'}
}));
/**
 * A controller for specific section loop. Subject may control the section they wanna loop
 */
export const AudioSectionLoopingController = function ({refs, currentTime, setTimeUpdate}: { refs: RefObject<HTMLAudioElement> [], currentTime: number, setTimeUpdate: (_: () => void) => void}) {
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
