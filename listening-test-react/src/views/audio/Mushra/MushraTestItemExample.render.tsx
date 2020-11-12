import {observer} from "mobx-react";
import {AudioExampleModel, AudioFileModel} from "../../../shared/models/AudioTestModel";
import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {SurveyControlRender} from "../../../shared/components/SurveyControl.render";
import {AudioButton, AudioController, useAudioPlayer} from "../../../shared/web-audio/AudiosPlayer";
import {AudioLoading, useAllAudioReady} from "../../../shared/web-audio/AudiosLoading";
import {useRandomization} from "../../../shared/RandomizationTools";
import {ratingAreaStyle} from "../../SharedStyles";
import {AudioSectionLoopingController} from "../../../shared/web-audio/AudioSectionLoopingController";
import {Box, Slider} from "@material-ui/core";

export const MushraTestItemExampleRender = observer(function (props: { value: AudioExampleModel, active?: boolean }) {
  const {value, active} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, handleTimeUpdate, handlePlay, handlePause, handleEnded} = useAudioPlayer(value.medias, value.mediaRef, value);
  const allRefs = value.mediaRef ? [...refs, sampleRef] : refs;
  const loading = useAllAudioReady(allRefs);
  // An event for setting Time update method
  const [onTimeUpdate, setOnTimeUpdate] = useState<() => void>();
  // Create empty slots for randomized audios
  const [randomAudios] = useRandomization(value.medias, active && value.settings?.randomMedia);

  useEffect(() => {
    if (active === false) handlePause();
  }, [active]);

  return <> <AudioLoading showing={loading}/>
    <Grid container spacing={3} style={{display: loading ? 'none' : 'flex'}}>
      {value.fields?.map((value, i) => <Grid item xs={12} key={i}>
        <SurveyControlRender control={value}/>
      </Grid>)}

      {randomAudios.map((v, i) => <Grid item key={i} style={ratingAreaStyle}>
        <MusharaRatingBar audio={v}/>
        <AudioButton ref={refs[i]} audio={v} onPlay={handlePlay} onPause={handlePause}
                     onEnded={i === 0 ? handleEnded : undefined}
                     onTimeUpdate={i === 0 ? onTimeUpdate ? onTimeUpdate : handleTimeUpdate : undefined}>{i + 1}</AudioButton>
        {/*{isDevMode() && <span>{refs[i].current?.currentTime}</span>}*/}
      </Grid>)}

      {/*Reference*/}
      {value.mediaRef && <Grid item style={ratingAreaStyle}>
        <AudioButton ref={sampleRef} audio={value.mediaRef} onPlay={handlePlay} onPause={handlePause}>Ref</AudioButton>
        {/*{isDevMode() && <span>{sampleRef?.current?.currentTime}</span>}*/}
      </Grid>}

      <Grid item xs={12}>
        <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}
                         disabled={value.settings?.disablePlayerSlider}/>
        {value.settings?.sectionLooping &&
        <AudioSectionLoopingController setTimeUpdate={f => setOnTimeUpdate(f)} refs={allRefs}
                                       currentTime={currentTime}/>}
      </Grid>
    </Grid>
  </>
});

const marks = [
  {value: 0, label: '0'},
  {value: 20, label: '20'},
  {value: 40, label: '40'},
  {value: 60, label: '60'},
  {value: 80, label: '80'},
  {value: 100, label: '100'},
];

export const MusharaRatingBar = observer(function (props: { audio: AudioFileModel }) {
  useEffect(() => {
    // Set a default value
    const num = parseInt(props.audio.value);
    if (!num) props.audio.value = '0';
  });

  return <Box ml={2.5} mb={2} mt={2} style={{height: 200}}>
    <Slider orientation="vertical" aria-labelledby="vertical-slider" min={0} max={100} step={1} marks={marks}
            valueLabelDisplay="auto" value={Number(props.audio.value)}
            onChange={(_, value) => props.audio.value = value.toString()}/>
  </Box>
})
