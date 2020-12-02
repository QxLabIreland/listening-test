import {observer} from "mobx-react";
import {AudioExampleModel, AudioFileModel} from "../../../shared/models/AudioTestModel";
import React, {useContext, useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {SurveyControlRender} from "../../../shared/components/SurveyControl.render";
import {AudioButton, AudioController, useAudioPlayer} from "../../../shared/web-audio/AudiosPlayer";
import {AudioLoading, useAllAudioRefsReady} from "../../../shared/web-audio/AudiosLoading";
import {useRandomization} from "../../../shared/RandomizationTools";
import {ratingAreaStyle, useMatStyles} from "../../SharedStyles";
import {AudioSectionLoopingController} from "../../../shared/web-audio/AudioSectionLoopingController";
import {Box, Collapse, Slider, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {GlobalDialog} from "../../../shared/ReactContexts";
import {validatePlayedOnceError} from "../../../shared/ErrorValidators";

export const AcrTestItemExampleRender = observer(function (props: { example: AudioExampleModel, active?: boolean, previewMode?: boolean }) {
  const {example, active, previewMode} = props;
  const classes = useMatStyles();
  // Randomize first to make sure random audio match the dom tree
  const [randomAudios, randomPattern] = useRandomization(example.medias, active && example.settings?.randomMedia, example.settings?.fixLastInternalQuestion);
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {
    refs, sampleRef, currentTime, handleTimeUpdate, handlePlay, handlePause, handleEnded, resetCurrentTime
  } = useAudioPlayer(randomAudios, example.mediaRef, example);
  const allRefs = example.mediaRef ? [...refs, sampleRef] : refs;
  const loading = useAllAudioRefsReady(allRefs);
  // An event for setting Time update method
  const [onTimeUpdate, setOnTimeUpdate] = useState<() => void>();
  // Current activated internal questions
  const [currentIndex, setCurrentIndex] = useState(0);
  const openDialog = useContext(GlobalDialog);
  useEffect(() => {
    if (active === false) handlePause();
    // If there are more 1 internal question, block next question
    else if (example.medias.length > 1) example.blockNext = true;
  }, [active]);
  // To fix a warning that update state during rendering
  useEffect(() => {
    if (currentIndex >= randomAudios.length - 1) example.blockNext = false;
    // Delete placedOnce for next internal question
    else delete example.playedOnce;
  }, [currentIndex]);

  const handleClickNext = () => {
    if (currentIndex < randomAudios.length) {
      // Validation for require full listening
      const error = validatePlayedOnceError(example);
      if (error && !previewMode) {
        openDialog(error);
        return;
      }
      handlePause();
      resetCurrentTime();
      // If new state is at end of internal question, the next question button will be un block
      setCurrentIndex(currentIndex + 1);
    }
  }

  return <>
    <AudioLoading showing={loading}/>
    <Grid container spacing={2} style={{display: loading ? 'none' : 'flex'}}>
      {example.fields?.length === randomPattern.length ? randomPattern.map(
        // Use collapse as transition to give subjects an illusion
        (ri, i) => <Grid item key={i} xs={12} hidden={currentIndex !== i}>
          <Collapse in={currentIndex === i} timeout={{enter: 250, exit: 0}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SurveyControlRender control={example.fields[ri]}/>
              </Grid>
              <Grid item>
                <AcrRatingBar audio={randomAudios[i]}/>
                <AudioButton ref={refs[i]} audio={randomAudios[i]} onPlay={handlePlay} onPause={handlePause}
                             onEnded={i === 0 ? handleEnded : undefined}
                             onTimeUpdate={i === 0 ? onTimeUpdate ? onTimeUpdate : handleTimeUpdate : undefined}/>
              </Grid>
              {/*Reference*/}
              {example.mediaRef && <Grid item style={ratingAreaStyle}>
                <AudioButton ref={sampleRef} audio={example.mediaRef} onPlay={handlePlay}
                             onPause={handlePause}>Ref</AudioButton>
              </Grid>}
              {/*Audio tracking bar*/}
              <Grid item xs={12}>
                <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}
                                 disabled={example.settings?.disablePlayerSlider}/>
                {example.settings?.sectionLooping &&
                <AudioSectionLoopingController setTimeUpdate={f => setOnTimeUpdate(f)} refs={allRefs}
                                               currentTime={currentTime}/>}
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      ) : <Grid item xs={12}><Typography color="secondary">
        Task configuration has an error. If you are creator please delete this question and create a new one.
        This text only appears when the test is out of date.
      </Typography></Grid>}

      {example.blockNext && <Grid item xs={12} className={classes.flexEnd}>
        <Button color="primary" onClick={handleClickNext} disabled={example.fields?.length !== randomPattern.length}>Next</Button>
      </Grid>}
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

