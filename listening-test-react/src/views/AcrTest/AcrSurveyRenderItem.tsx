import React, {CSSProperties, useEffect} from "react";
import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {TestItemType} from "../../shared/models/EnumsAndTypes";
import {RenderSurveyControl, surveyControlValidateError} from "../../shared/components/RenderSurveyControl";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import Grid from "@material-ui/core/Grid";
import {AudioButton, AudioController, useAudioPlayer} from "../../shared/components/AudiosPlayer";
import {Box, Slider} from "@material-ui/core";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import {RenderSurveyTraining} from "../components/RenderSurveyTraining";

export function sliderItemValidateError(item: TestItemModel): string {
  if (item == null) return null;
  else if (item.type === TestItemType.question) return surveyControlValidateError(item.questionControl);
  else if (item.type === TestItemType.example) {
    for (const a of item.example.audios) {
      if (!a.value) return 'The example input (slider bar) is required'
    }
    return null;
  }
  else return null;
}

export const AcrSurveyRenderItem = observer(function (props: { item: TestItemModel, active?: boolean }) {
  const {item, ...rest} = props;
  switch (item.type) {
    case TestItemType.question:
      return <RenderSurveyControl control={item.questionControl} {...rest}/>
    case TestItemType.example:
      return <RenderRatingExample value={item.example} {...rest}/>;
    case TestItemType.training:
      return <RenderSurveyTraining value={item.example} {...rest}/>;
    default:
      return null;
  }
})

const RatingAreaStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end'
} as CSSProperties;

const RenderRatingExample = observer(function (props: { value: ItemExampleModel, active?: boolean }) {
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

    {value.audios.map((v, i) => <Grid item key={i} style={RatingAreaStyle}>
      <AudioRatingBar audio={v}/>
      <AudioButton ref={refs[i]} audio={v} onPlay={onPlay} onPause={onPause} settings={value.settings}
                   onTimeUpdate={i === 0 ? onTimeUpdate : undefined}>{i + 1}</AudioButton>
      {/*{isDevMode() && <span>{refs[i].current?.currentTime}</span>}*/}
    </Grid>)}

    {/*Reference*/}
    {value.audioRef && <Grid item style={RatingAreaStyle}>
      <AudioButton ref={sampleRef} audio={value.audioRef} onPlay={onPlay} onPause={onPause}>Ref</AudioButton>
      {/*{isDevMode() && <span>{sampleRef?.current?.currentTime}</span>}*/}
    </Grid>}

    <Grid item xs={12}>
      <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}/>
    </Grid>
  </Grid>
})

const AudioRatingBar = observer(function (props: { audio: AudioFileModel}) {
  const marks = [
    {value: 1, label: '1 - Bad'},
    {value: 2, label: '2 - Poor'},
    {value: 3, label: '3 - Fair'},
    {value: 4, label: '4 - Good'},
    {value: 5, label: '5 - Excellent'},
  ];

  // Set a default value
  const num = parseInt(props.audio.value);
  if (!num && num !== 0) props.audio.value = '3';

  return <Box ml={2.5} mb={2} mt={2} style={{height: 200}}>
    <Slider orientation="vertical" aria-labelledby="vertical-slider" min={1} max={5} step={1} track={false}
            getAriaValueText={(value: number) => `${value}`} marks={marks}
            value={Number(props.audio.value)}
            onChange={(_, value) => props.audio.value = value.toString()}/>
  </Box>
})
