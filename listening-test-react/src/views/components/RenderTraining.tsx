import {observer} from "mobx-react";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import {AudioButton, AudioController} from "../../shared/web-audio/AudiosPlayer";
import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {RenderSurveyControl} from "../../shared/components/RenderSurveyControl";
import Slider from "@material-ui/core/Slider";

export const RenderTraining = observer(function (props: { value: ItemExampleModel, active?: boolean}) {
  const {value, active} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  useEffect(() => {
    if (active === false) handlePause();
  }, [active]);
  const [refs] = useState<HTMLAudioElement[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  // TODO Implement audios loop and played once checking
  const [playedTimes] = useState(new Array(value.audios.length).fill(0));

  const handlePlay = (index: number) => {
    // Pause others, and play the one we clicked
    handlePause();
    refs[index].play().then();
    setCurrentTime(refs[index].currentTime);
    value.audios[index].isPlaying = true;
    // Set current index for slider bar
    setCurrentAudioIndex(index);
  }
  const handlePause = () => {
    refs[currentAudioIndex].pause();
    value.audios[currentAudioIndex].isPlaying = false;
  }
  const handleTimeUpdate = () => setCurrentTime(refs[currentAudioIndex].currentTime);
  // When loop attribute is true, this won't be called
  const handleEnded = () => {
    value.playedOnce = true;
  }
  const dragSlider = (event: any, newValue: number | number[]) =>
    refs[currentAudioIndex].currentTime = newValue ? Number(newValue) : 0;

  return <Grid container spacing={3}>
    {value.fields?.map((value, i) => <Grid item xs={12} key={i}>
      <RenderSurveyControl control={value}/>
    </Grid>)}

    {value.audios.map((v, i) => <Grid item key={i}>
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
