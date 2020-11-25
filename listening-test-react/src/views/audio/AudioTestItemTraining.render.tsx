import {observer} from "mobx-react";
import {AudioExampleModel} from "../../shared/models/AudioTestModel";
import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {SurveyControlRender} from "../../shared/components/SurveyControl.render";
import {AudioButton} from "../../shared/web-audio/AudiosPlayer";
import Slider from "@material-ui/core/Slider";

export const AudioTestItemTraining = observer(function (props: { value: AudioExampleModel, active?: boolean }) {
  const {value, active} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  useEffect(() => {
    if (active === false) handlePause();
  }, [active]);
  const [refs] = useState<HTMLAudioElement[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  // Audios loop and played once checking
  const [playedTimes] = useState(new Array(value.medias.length).fill(0));

  const handlePlay = (newIndex: number) => {
    // Pause others, and play the one we clicked
    handlePause();
    refs[newIndex].play().then();
    setCurrentTime(refs[newIndex].currentTime);
    value.medias[newIndex].isActive = true;
    // Set current index for slider bar
    setCurrentAudioIndex(newIndex);
  }
  const handlePause = () => {
    refs[currentAudioIndex].pause();
    value.medias[currentAudioIndex].isActive = false;
  }
  const handleTimeUpdate = () => setCurrentTime(refs[currentAudioIndex].currentTime);
  // When loop attribute is true, this won't be called
  const handleEnded = () => {
    playedTimes[currentAudioIndex] += 1;
    // If didn't specify loopTimes or playedTimes < loopTimes, it will play again.
    if (!value.settings?.loopTimes || playedTimes[currentAudioIndex] < value.settings?.loopTimes)
      // Active makes sure it doesn't play in background. Only play and pause will change isActive
      if (value.medias[currentAudioIndex].isActive) handlePlay(currentAudioIndex);
    // Check all clips have been played
    if (playedTimes.every(t => t > 0)) value.playedOnce = true;
  }
  const dragSlider = (event: any, newValue: number | number[]) =>
    refs[currentAudioIndex].currentTime = newValue ? Number(newValue) : 0;

  return <Grid container spacing={2}>
    {/*Description for the example*/}
    {value.fields && value.fields[0] && <Grid item xs={12}>
      <SurveyControlRender control={value.fields[0]}/>
    </Grid>}
    {value.medias.map((v, i) => <Grid item key={i}>
      <AudioButton ref={ref => refs[i] = ref} audio={v} onPlay={() => handlePlay(i)} onPause={handlePause}
                   onEnded={handleEnded} onTimeUpdate={handleTimeUpdate}>{i + 1}</AudioButton>
    </Grid>)}
    {/*Slider bar of player */}
    <Grid item xs={12}>
      <Slider aria-labelledby="continuous-slider" defaultValue={0} step={0.1} min={0}
              max={refs[currentAudioIndex]?.duration} value={currentTime} onChange={dragSlider}
              valueLabelDisplay="auto" valueLabelFormat={num => isNaN(num) ? 0 : num.toFixed(0) + 's'}
              disabled={value.settings?.disablePlayerSlider}
      />
    </Grid>
    {/*Ask a question for training*/}
    {value.fields?.slice(1).map((v, i) => <Grid item xs={12} key={i}>
      <SurveyControlRender control={v}/>
    </Grid>)}
  </Grid>
})
