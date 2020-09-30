import {observer} from "mobx-react";
import {AudioButton, AudioController, useAudioPlayer} from "../../shared/web-audio/AudiosPlayer";
import {AudioLoading, useAllAudioReady} from "../../shared/web-audio/AudiosLoading";
import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {RenderSurveyControl} from "../../shared/components/RenderSurveyControl";
import {ratingAreaStyle} from "../SharedStyles";
import {AudioExampleModel, AudioFileModel} from "../../shared/models/AudioTestModel";
import {AudioSectionLoopingController} from "../../shared/web-audio/AudioSectionLoopingController";

export const RenderRatingExample = observer(function (props: { value: AudioExampleModel, RatingBar: (props: { audio: AudioFileModel }) => JSX.Element, active?: boolean }) {
  const {value, RatingBar, active} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, handleTimeUpdate, handlePlay, handlePause, handleEnded} = useAudioPlayer(value.medias, value.mediaRef, value);
  const allRefs = value.mediaRef ? [...refs, sampleRef] : refs;
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

      {value.medias.map((v, i) => <Grid item key={i} style={ratingAreaStyle}>
        <RatingBar audio={v}/>
        <AudioButton ref={refs[i]} audio={v} onPlay={handlePlay} onPause={handlePause} onEnded={i === 0 ? handleEnded : undefined}
                     onTimeUpdate={i === 0 ? onTimeUpdate ? onTimeUpdate : handleTimeUpdate : undefined}>{i + 1}</AudioButton>
        {/*{isDevMode() && <span>{refs[i].current?.currentTime}</span>}*/}
      </Grid>)}

      {/*Reference*/}
      {value.mediaRef && <Grid item style={ratingAreaStyle}>
        <AudioButton ref={sampleRef} audio={value.mediaRef} onPlay={handlePlay} onPause={handlePause}>Ref</AudioButton>
        {/*{isDevMode() && <span>{sampleRef?.current?.currentTime}</span>}*/}
      </Grid>}

      <Grid item xs={12}>
        <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime} disabled={value.settings?.disablePlayerSlider}/>
        {value.settings?.sectionLooping && <AudioSectionLoopingController setTimeUpdate={f => setOnTimeUpdate(f)} refs={allRefs} currentTime={currentTime}/>}
      </Grid>
    </Grid>
  </>
})
