import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {AudioExampleModel} from "../../../shared/models/AudioTestModel";
import {SurveyControlRender} from "../../forms/SurveyControl.render";
import Grid from "@material-ui/core/Grid";
import {AudioButton, AudioController, useAudioPlayer} from "../../web-audio/AudiosPlayer";
import {AudioLoading, useAllAudioRefsReady} from "../../web-audio/AudiosLoading";
import {AudioSectionLoopingController} from "../../web-audio/AudioSectionLoopingController";

const alphabetList = Array.apply(undefined, Array(26)).map(function (x, y) {
  return String.fromCharCode(y + 65);
}).join('');


export const AbTestItemExampleRender = observer(function (props: { value: AudioExampleModel, active?: boolean }) {
  const {value, active} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, handleTimeUpdate, handlePlay, handlePause, handleEnded} = useAudioPlayer(value.medias, value.mediaRef, value);
  const loading = useAllAudioRefsReady(value.mediaRef ? [...refs, sampleRef] : refs);
  const allRefs = value.mediaRef ? [...refs, sampleRef] : refs;
  const [onTimeUpdate, setOnTimeUpdate] = useState<() => void>();
  // Create empty slots for randomized audios

  useEffect(() => {
    if (active === false) handlePause();
  }, [active]);

  return <> <AudioLoading showing={loading}/>
    <Grid container spacing={2} style={{display: loading ? 'none' : 'flex'}}>

      {value.medias.map((v, i) => v && <Grid item key={i}>
        <AudioButton ref={refs[i]} audio={v} onPlay={handlePlay} onPause={handlePause}
                     onEnded={i === 0 ? handleEnded : undefined}
                     onTimeUpdate={i === 0 ? onTimeUpdate ? onTimeUpdate : handleTimeUpdate : undefined}>
          {value.fields[0]?.options[i] || alphabetList[i]}
        </AudioButton>
        {/*{isDevMode() && <span>{refs[i].current?.currentTime}</span>}*/}
      </Grid>)}

      {/*Reference*/}
      {value.mediaRef && <Grid item>
        <AudioButton ref={sampleRef} audio={value.mediaRef} onPlay={handlePlay} onPause={handlePause}>Ref</AudioButton>
        {/*{isDevMode() && <span>{sampleRef?.current?.currentTime}</span>}*/}
      </Grid>}

      {value.fields?.map((value, i) => <Grid item xs={12} key={i}>
        <SurveyControlRender control={value}/>
      </Grid>)}

      <Grid item xs={12}>
        <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}
                         disabled={value.settings?.disablePlayerSlider}/>
        {value.settings?.sectionLooping &&
        <AudioSectionLoopingController setTimeUpdate={f => setOnTimeUpdate(f)} refs={allRefs}
                                       currentTime={currentTime}/>}
      </Grid>
    </Grid>
  </>
})
