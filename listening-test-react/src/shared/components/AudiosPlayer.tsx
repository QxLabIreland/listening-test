import React, {forwardRef, RefObject, useRef, useState} from "react";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Slider from "@material-ui/core/Slider";
import {AudioFileModel} from "../models/AudioFileModel";
import {ItemExampleSettingsModel} from "../models/ItemExampleModel";

/** In order to build a custom audio player including rating bar,
 *  use this hook with AudioButton and AudioController components */
export function useAudioPlayer(audios: AudioFileModel[], sample: AudioFileModel) {
  const [currentTime, setCurrentTime] = useState(0);
  const [refs] = useState(audios.map(() => React.createRef<HTMLAudioElement>()));
  const sampleRef = useRef<HTMLAudioElement>();

  // Include the reference audio for player controller, make sure they work in the same way
  const includeAll = () => Object.create({
    allAudio: sample ? [...audios, sample] : audios,
    allRefs: sample ? [...refs, sampleRef] : refs
  });

  const handlePlay = (v: AudioFileModel) => {
    const {allAudio, allRefs} = includeAll();
    allAudio.forEach((a: AudioFileModel, i: number) => {
      // Adjust properties
      allAudio[i].isPlaying = a === v;
      allRefs[i].current.volume = a === v ? 1 : 0;
      // Play after
      allRefs[i].current.play().then();
    });
  }

  const handlePause = () => {
    // Deconstruction for all including reference audio
    const {allAudio, allRefs} = includeAll();
    allRefs.forEach((_: AudioFileModel, i: number) => {
      allAudio[i].isPlaying = false;
      allRefs[i].current.pause();
      // State that if it is ready
      // console.log(allRefs[i].current.readyState)
    });
  }

  const handleTimeUpdate = () => {
    setCurrentTime(refs[0].current.currentTime);
  }
  // Reference audio
  // const sampleNode = <AudioButton audio={sample} ref={sampleRef} onPlay={handlePlay} onPause={handlePause}>Ref</AudioButton>
  //
  // const audioNodes = audios.map((v, i) =>
  //   <AudioButton key={i} audio={v} ref={refs[i]} onPlay={handlePlay} onPause={handlePause}
  //                onTimeUpdate={i === 0 ? handleTimeUpdate : undefined}>{i + 1}</AudioButton>
  // );
  // const controllerNode = <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}/>

  return {refs, sampleRef, currentTime, onPlay: handlePlay, onPause: handlePause, onTimeUpdate: handleTimeUpdate};
}

// This component exposes the audio to outside. Control audio with ref attribute.
export const AudioButton = forwardRef<HTMLAudioElement, {
  audio: AudioFileModel, onPlay: (v: AudioFileModel) => void, onPause: () => void, onTimeUpdate?: () => void, settings?: ItemExampleSettingsModel, children?: any
}>(function (props, ref) {
  const {audio, onTimeUpdate, onPlay, onPause, settings} = props;
  const [playedTimes, setPlayedTimes] = useState(0);

  // When loop attribute is true, this won't be called
  const handleAudioEnded = () => {
    // playedTimes will be added when the audio ENDS
    if (playedTimes + 1 < settings?.loopTimes)
      (ref as React.RefObject<HTMLAudioElement>).current.play().then();
    // Make sure the button style looks right
    else audio.isPlaying = false;
    setPlayedTimes(playedTimes + 1);
  }

  return <>
    <audio src={audio.src} controls loop={!settings?.loopTimes} ref={ref} style={{display: 'none'}} preload="auto"
           onTimeUpdate={onTimeUpdate} onEnded={handleAudioEnded}/>

    <Button variant={audio.isPlaying ? 'contained' : 'outlined'} color="primary" size="large"
            style={{transition: 'none'}}
            // disabled={playedTimes >= settings?.loopTimes}
            startIcon={<Icon>{audio.isPlaying ? 'pause' : 'play_arrow'}</Icon>}
            onClick={() => audio.isPlaying ? onPause() : onPlay(audio)}>
      {props.children}
    </Button>
  </>
})

export function AudioController(props: { refs: RefObject<HTMLAudioElement>[], sampleRef: RefObject<HTMLAudioElement>, currentTime: number }) {
  const {refs, sampleRef, currentTime} = props;

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

  return <Slider aria-labelledby="continuous-slider" defaultValue={0} step={0.1} min={0}
                 max={refs[0].current?.duration} value={currentTime} onChange={dragSlider}
                 valueLabelDisplay="auto" valueLabelFormat={handleSliderLabelFormat}/>;
}
