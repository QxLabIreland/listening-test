import {observer} from "mobx-react";
import {AudioExampleModel, AudioFileModel} from "../../../shared/models/AudioTestModel";
import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {SurveyControlRender} from "../../forms/SurveyControl.render";
import {AudioButton, AudioController, useAudioPlayer} from "../../web-audio/AudiosPlayer";
import {AudioLoading, useAllAudioRefsReady} from "../../web-audio/AudiosLoading";
import {useRandomization} from "../../../shared/tools/RandomizationTools";
import {ratingAreaStyle} from "../../../shared/SharedStyles";
import {AudioSectionLoopingController} from "../../web-audio/AudioSectionLoopingController";
import {Box, Slider} from "@material-ui/core";

export const MushraTestItemExampleRender = observer(function (props: { example: AudioExampleModel, active?: boolean }) {
  const {example, active} = props;
  // Randomize first to make sure random audio match the dom tree
  const [randomAudios] = useRandomization(example.medias, active && example.settings?.randomMedia, example.settings?.fixLastInternalQuestion);
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, handleTimeUpdate, handlePlay, handlePause, handleEnded} = useAudioPlayer(randomAudios, example.mediaRef, example);
  const allRefs = example.mediaRef ? [...refs, sampleRef] : refs;
  const loading = useAllAudioRefsReady(allRefs);
  // An event for setting Time update method
  const [onTimeUpdate, setOnTimeUpdate] = useState<() => void>();

  useEffect(() => {
    if (active === false) handlePause();
  }, [active]);

  return <> <AudioLoading showing={loading}/>
    <Grid container spacing={2} style={{display: loading ? 'none' : 'flex'}}>
      {example.fields?.map((value, i) => <Grid item xs={12} key={i}>
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
      {example.mediaRef && <Grid item style={ratingAreaStyle}>
        <AudioButton ref={sampleRef} audio={example.mediaRef} onPlay={handlePlay} onPause={handlePause}>Ref</AudioButton>
        {/*{isDevMode() && <span>{sampleRef?.current?.currentTime}</span>}*/}
      </Grid>}

      <Grid item xs={12}>
        <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}
                         disabled={example.settings?.disablePlayerSlider}/>
        {example.settings?.sectionLooping &&
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
