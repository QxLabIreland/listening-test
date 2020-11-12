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

export const AcrTestItemExampleRender = observer(function (props: { example: AudioExampleModel, active?: boolean }) {
  const {example, active} = props;
  // Randomize first to make sure random audio match the dom tree
  const [randomAudios, randomPattern] = useRandomization(example.medias, active && example.settings?.randomMedia);
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, handleTimeUpdate, handlePlay, handlePause, handleEnded} = useAudioPlayer(randomAudios, example.mediaRef, example);
  const allRefs = example.mediaRef ? [...refs, sampleRef] : refs;
  const loading = useAllAudioReady(allRefs);
  // An event for setting Time update method
  const [onTimeUpdate, setOnTimeUpdate] = useState<() => void>();
  // Create empty slots for randomized audios
  useEffect(() => {
    if (active === false) handlePause();
  }, [active]);

  return <> <AudioLoading showing={loading}/>
    <Grid container spacing={3} style={{display: loading ? 'none' : 'flex'}}>
      {example.fields?.length === randomPattern.length && randomPattern?.map((ri, i) => <Grid item xs={12} key={i}>
        <SurveyControlRender control={example.fields[ri]}/>
      </Grid>)}

      {randomAudios?.map((v, i) => <Grid item key={i} style={ratingAreaStyle}>
        <AcrRatingBar audio={v}/>
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
  {value: 1, label: '1 - Bad'},
  {value: 2, label: '2 - Poor'},
  {value: 3, label: '3 - Fair'},
  {value: 4, label: '4 - Good'},
  {value: 5, label: '5 - Excellent'},
];

export const AcrRatingBar = observer(function ({audio}: { audio: AudioFileModel }) {

  useEffect(() => {
    // Set a default value
    if (!parseInt(audio.value) && audio.value !== '0') audio.value = '3';
  });

  return <Box ml={2.5} mb={2} mt={2} style={{height: 200}}>
    <Slider orientation="vertical" aria-labelledby="vertical-slider" min={1} max={5} step={1} track={false}
            getAriaValueText={(value: number) => `${value}`} marks={marks}
            value={Number(audio.value)}
            onChange={(_, value) => audio.value = value.toString()}/>
  </Box>
});

