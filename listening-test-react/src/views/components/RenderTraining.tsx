import {observer} from "mobx-react";
import {AudioButton} from "../../shared/web-audio/AudiosPlayer";
import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {RenderSurveyControl} from "../../shared/components/RenderSurveyControl";
import Slider from "@material-ui/core/Slider";
import {AudioExampleModel} from "../../shared/models/AudioTestModel";

export const RenderTraining = observer(function (props: { value: AudioExampleModel, active?: boolean}) {
  const {value, active} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  useEffect(() => {
    if (active === false) handlePause();
  }, [active]);
  const [refs] = useState<HTMLAudioElement[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  // TODO Implement audios loop and played once checking
  const [playedTimes] = useState(new Array(value.medias.length).fill(0));

  const handlePlay = (index: number) => {
    // Pause others, and play the one we clicked
    handlePause();
    refs[index].play().then();
    setCurrentTime(refs[index].currentTime);
    value.medias[index].isActive = true;
    // Set current index for slider bar
    setCurrentAudioIndex(index);
  }
  const handlePause = () => {
    refs[currentAudioIndex].pause();
    value.medias[currentAudioIndex].isActive = false;
  }
  const handleTimeUpdate = () => setCurrentTime(refs[currentAudioIndex].currentTime);
  // When loop attribute is true, this won't be called
  const handleEnded = () => {
    value.medias[currentAudioIndex].isActive = false;
    playedTimes[currentAudioIndex] += 1;
    // If didn't specify loopTimes or playedTimes < loopTimes, it will play again
    if (!value.settings?.loopTimes || playedTimes[currentAudioIndex] < value.settings?.loopTimes)
      handlePlay(currentAudioIndex);
    // Check all clips have been played
    if (playedTimes.every(t => t > 0)) value.playedOnce = true;
  }
  const dragSlider = (event: any, newValue: number | number[]) =>
    refs[currentAudioIndex].currentTime = newValue ? Number(newValue) : 0;

  return <Grid container spacing={3}>
    {value.fields?.map((value, i) => <Grid item xs={12} key={i}>
      <RenderSurveyControl control={value}/>
    </Grid>)}

    {value.medias.map((v, i) => <Grid item key={i}>
      <AudioButton ref={ref => refs[i] = ref} audio={v} onPlay={() => handlePlay(i)} onPause={handlePause}
                   onEnded={handleEnded} onTimeUpdate={handleTimeUpdate}>{i + 1}</AudioButton>
    </Grid>)}

    <Grid item xs={12}>
      <Slider aria-labelledby="continuous-slider" defaultValue={0} step={0.1} min={0}
              max={refs[currentAudioIndex]?.duration} value={currentTime} onChange={dragSlider}
              valueLabelDisplay="auto" valueLabelFormat={num => isNaN(num) ? 0 : num.toFixed(0) + 's'}
              disabled={value.settings?.disablePlayerSlider}
      />
    </Grid>
  </Grid>
})
