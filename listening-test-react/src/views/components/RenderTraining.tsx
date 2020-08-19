import {observer} from "mobx-react";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import {AudioButton, AudioController, useAudioPlayer} from "../../shared/web-audio/AudiosPlayer";
import React, {useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import {RenderSurveyControl} from "../../shared/components/RenderSurveyControl";

export const RenderTraining = observer(function (props: { value: ItemExampleModel, active?: boolean, disableSlider?: boolean }) {
  const {value, active, disableSlider = false} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, handleTimeUpdate, handlePlay, handlePause, handleEnded} = useAudioPlayer(value.audios, value.audioRef, value);

  useEffect(() => {
    if (active === false) handlePause();
  }, [active]);

  return <Grid container spacing={3}>

    {value.fields?.map((value, i) => <Grid item xs={12} key={i}>
      <RenderSurveyControl control={value}/>
    </Grid>)}

    {value.audios.map((v, i) => <Grid item key={i}>
      <AudioButton ref={refs[i]} audio={v} onPlay={handlePlay} onPause={handlePause} onEnded={i === 0 ? handleEnded : undefined}
                   onTimeUpdate={i === 0 ? handleTimeUpdate : undefined}>{i + 1}</AudioButton>
      {/*{isDevMode() && <span>{refs[i].current?.currentTime}</span>}*/}
    </Grid>)}

    {!disableSlider && <Grid item xs={12}>
      <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}/>
    </Grid>}
  </Grid>
})
