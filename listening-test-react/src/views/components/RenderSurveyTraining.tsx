import {observer} from "mobx-react";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import {AudioButton, AudioController, useAudioPlayer} from "../../shared/web-audio/AudiosPlayer";
import React, {useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import {RenderSurveyControl} from "../../shared/components/RenderSurveyControl";

export const RenderSurveyTraining = observer(function (props: { value: ItemExampleModel, active?: boolean }) {
  const {value, active} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, onTimeUpdate, onPlay, onPause} = useAudioPlayer(value.audios, value.audioRef);

  useEffect(() => {
    if (active === false) onPause();
  }, [active]);

  return <Grid container spacing={3}>

    {value.fields?.map((value, i) => <Grid item xs={12} key={i}>
      <RenderSurveyControl control={value}/>
    </Grid>)}

    {value.audios.map((v, i) => <Grid item key={i}>
      <AudioButton ref={refs[i]} audio={v} onPlay={onPlay} onPause={onPause} settings={value.settings}
                   onTimeUpdate={i === 0 ? onTimeUpdate : undefined}>{i + 1}</AudioButton>
      {/*{isDevMode() && <span>{refs[i].current?.currentTime}</span>}*/}
    </Grid>)}

    <Grid item xs={12}>
      <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}/>
    </Grid>
  </Grid>
})
