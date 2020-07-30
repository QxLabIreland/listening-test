import {observer} from "mobx-react";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import {AudioButton, AudioController, useAudioPlayer} from "../../shared/web-audio/AudiosPlayer";
import {AudioLoading, useAllAudioReady} from "../../shared/web-audio/AudiosLoading";
import React, {useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import {RenderSurveyControl} from "../../shared/components/RenderSurveyControl";
import {ratingAreaStyle} from "../SharedStyles";

export const RenderRatingExample = observer(function (props: { value: ItemExampleModel, RatingBar: (props: { audio: AudioFileModel }) => JSX.Element, active?: boolean }) {
  const {value, RatingBar, active} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, onTimeUpdate, onPlay, onPause} = useAudioPlayer(value.audios, value.audioRef);
  const loading = useAllAudioReady(value.audioRef ? [...refs, sampleRef] : refs);

  useEffect(() => {
    if (active === false) onPause();
  }, [active]);

  return <> <AudioLoading showing={loading}/>
    <Grid container spacing={3} style={{display: loading ? 'none' : 'flex'}}>
      {value.fields?.map((value, i) => <Grid item xs={12} key={i}>
        <RenderSurveyControl control={value}/>
      </Grid>)}

      {value.audios.map((v, i) => <Grid item key={i} style={ratingAreaStyle}>
        <RatingBar audio={v}/>
        <AudioButton ref={refs[i]} audio={v} onPlay={onPlay} onPause={onPause} settings={value.settings}
                     onTimeUpdate={i === 0 ? onTimeUpdate : undefined}>{i + 1}</AudioButton>
        {/*{isDevMode() && <span>{refs[i].current?.currentTime}</span>}*/}
      </Grid>)}

      {/*Reference*/}
      {value.audioRef && <Grid item style={ratingAreaStyle}>
        <AudioButton ref={sampleRef} audio={value.audioRef} onPlay={onPlay} onPause={onPause}>Ref</AudioButton>
        {/*{isDevMode() && <span>{sampleRef?.current?.currentTime}</span>}*/}
      </Grid>}

      <Grid item xs={12}>
        <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}/>
      </Grid>
    </Grid>
  </>
})
