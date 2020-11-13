import React, {forwardRef, RefObject, useRef, useState} from "react";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Slider from "@material-ui/core/Slider";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {AudioExampleModel, AudioFileModel} from "../models/AudioTestModel";
import {observer} from "mobx-react";

/**
 * In order to build a custom audio player including rating bar,
 *  use this hook with AudioButton and AudioController components
 */
export function useAudioPlayer(audios: AudioFileModel[], sample: AudioFileModel, example: AudioExampleModel) {
  const [currentTime, setCurrentTime] = useState(0);
  const [refs] = useState(audios.map(() => React.createRef<HTMLAudioElement>()));
  const sampleRef = useRef<HTMLAudioElement>();
  // played times records how many times the audio played #
  const [playedTimes, setPlayedTimes] = useState(0);

  // Include the reference audio for player controller, make sure they work in the same way
  const includeAll = (): { allAudio: AudioFileModel[], allRefs: RefObject<HTMLAudioElement>[] } => Object.create({
    allAudio: sample ? [...audios, sample] : audios,
    allRefs: sample ? [...refs, sampleRef] : refs
  });

  const handlePlay = (v: AudioFileModel) => {
    const {allAudio, allRefs} = includeAll();
    allAudio.forEach((a, i: number) => {
      // Adjust properties
      allAudio[i].isActive = a === v;
      allRefs[i].current.volume = a === v ? 1 : 0;
      // Play after
      allRefs[i].current.play().then();
    });
  }

  const handlePause = () => {
    // Deconstruction for all including reference audio
    const {allAudio, allRefs} = includeAll();
    allRefs.forEach((_, i: number) => {
      allAudio[i].isActive = false;
      allRefs[i].current?.pause();
      // State that if it is ready
      // console.log(allRefs[i].current.readyState)
    });
  }
  const handleTimeUpdate = () => {
    setCurrentTime(refs[0].current.currentTime);
  }
  // When loop attribute is true, this won't be called
  const handleEnded = () => {
    example.playedOnce = true;
    // playedTimes will be added when the audio ENDS
    if (!example.settings?.loopTimes || playedTimes + 1 < example.settings?.loopTimes) {
      // Find the one is playing
      const current = includeAll().allAudio.find(a => a.isActive);
      if (current) handlePlay(current);
    }
    // Make sure the button style looks right
    else handlePause();
    setPlayedTimes(playedTimes + 1);
  }
  // Reset current time of all the audios
  const resetCurrentTime = () => includeAll().allRefs.forEach(a => a.current.currentTime = 0);


  // // Reference audio
  // const sampleNode = <AudioButton audio={sample} ref={sampleRef} onPlay={handlePlay} onPause={handlePause}>Ref</AudioButton>
  //
  // const audioNodes = audios.map((v, i) =>
  //   <AudioButton key={i} audio={v} ref={refs[i]} onPlay={handlePlay} onPause={handlePause}
  //                onTimeUpdate={i === 0 ? handleTimeUpdate : undefined}>{i + 1}</AudioButton>
  // );
  // const controllerNode = <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}/>

  return {refs, sampleRef, currentTime, handlePlay, handlePause, handleTimeUpdate, handleEnded, resetCurrentTime};
}

/** This component exposes the audio to outside. Control audio with ref attribute. */
export const AudioButton = observer(forwardRef<HTMLAudioElement, {
  audio: AudioFileModel, onPlay: (v: AudioFileModel) => void, onPause: () => void, onTimeUpdate?: () => void, onEnded?: () => void, children?: any
}>(function (props, ref) {
  const {audio, onTimeUpdate, onPlay, onPause, onEnded} = props;

  // An AudioButton contains an audio element and a button. Use loop attribute, onEnded Event will not trigger.
  return <>
    <audio preload="auto" src={audio.src} controls ref={ref} style={{display: 'none'}}
           onTimeUpdate={onTimeUpdate} onEnded={onEnded}/>

    <Button variant={audio.isActive ? 'contained' : 'outlined'} color="primary" size="large"
            style={{transition: 'none'}}
      // disabled={playedTimes >= settings?.loopTimes}
            startIcon={<Icon>{audio.isActive ? 'pause' : 'play_arrow'}</Icon>}
            onClick={() => audio.isActive ? onPause() : onPlay(audio)}>
      {props.children}
    </Button>
  </>
}))

const useStyles = makeStyles((_: Theme) => ({thumb: {zIndex: 1}}));

export function AudioController(props: { refs: RefObject<HTMLAudioElement>[], sampleRef: RefObject<HTMLAudioElement>, currentTime: number, disabled?: boolean }) {
  const {refs, sampleRef, currentTime, disabled} = props;
  const classes = useStyles();

  const handleSliderLabelFormat = (num: number) => {
    return isNaN(num) ? 0 : num.toFixed(0) + 's'
  }

  const dragSlider = (event: any, newValue: number | number[]) => {
    // Set all audios time
    refs.forEach(r => r.current.currentTime = newValue ? Number(newValue) : 0);
    // Somethings there is no sample(reference)
    if (sampleRef && sampleRef.current) sampleRef.current.currentTime = newValue ? Number(newValue) : 0;
  }

  if (!refs[0]) return null;

  return <Slider aria-labelledby="continuous-slider" defaultValue={0} step={0.1} min={0} classes={classes}
                 max={refs[0].current?.duration} value={currentTime} onChange={dragSlider}
                 valueLabelDisplay="auto" valueLabelFormat={handleSliderLabelFormat}
                 disabled={disabled}
  />;
}
