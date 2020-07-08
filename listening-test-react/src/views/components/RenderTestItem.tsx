import React, {CSSProperties} from "react";
import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {TestItemType} from "../../shared/ReactEnums";
import {RenderSurveyControl} from "./RenderSurveyControl";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import Grid from "@material-ui/core/Grid";
import {AudioButton, AudioController, useAudioPlayer} from "../../shared/components/AudiosPlayer";
import {Box, Slider} from "@material-ui/core";
import {AudioFileModel} from "../../shared/models/AudioFileModel";

const RatingAreaStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end'
} as CSSProperties;

export const RenderTestItem = observer(function (props: { item: TestItemModel }) {

  switch (props.item.type) {
    case TestItemType.question:
      return <RenderSurveyControl control={props.item.questionControl}/>
    case TestItemType.example:
      return <RenderTestItemExample value={props.item.example}/>;
    case TestItemType.training:
      return <RenderTestItemExample value={props.item.example} isTraining={true}/>;
    default:
      return null;
  }
})

const RenderTestItemExample = observer(function (props: { value: ItemExampleModel, isTraining?: boolean }) {
  const {value, isTraining = false} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, handleTimeUpdate, ...restHandlers} = useAudioPlayer(value.audios, value.audioRef);

  return <Grid container spacing={3}>
    {value.audios.map((v, i) => <Grid item key={i} style={RatingAreaStyle}>
      {!isTraining && <AudioRatingBar audio={v}/>}
      <AudioButton ref={refs[i]} audio={v} {...restHandlers}
                   onTimeUpdate={i === 0 ? handleTimeUpdate : undefined}>{i + 1}</AudioButton>
      <span>{refs[i].current?.currentTime}</span>
    </Grid>)}

    {value.audioRef && <Grid item style={RatingAreaStyle}>
      <AudioButton ref={sampleRef} audio={value.audioRef} {...restHandlers}>Ref</AudioButton>
      <span>{sampleRef?.current?.currentTime}</span>
    </Grid>}

    <Grid item xs={12}>
      <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}/>
    </Grid>

    {value.fields?.map((value, i) => <Grid item xs={12} key={i}>
      <RenderSurveyControl control={value}/>
    </Grid>)}
  </Grid>
})

export const AudioRatingBar = observer(function (props: { audio: AudioFileModel}) {
  const marks = [
    {value: 0, label: 'Bad'},
    {value: 25, label: 'Poor'},
    {value: 50, label: 'Fair'},
    {value: 75, label: 'Good'},
    {value: 100, label: 'Excellent'},
  ];

  // Set a default value
  if (!parseInt(props.audio.value)) props.audio.value = '50';

  return <Box ml={2.5} mb={2} style={{height: 200}}>
    <Slider orientation="vertical" aria-labelledby="vertical-slider" min={0} max={100} step={25}
            getAriaValueText={(value: number) => `${value}`} marks={marks}
            value={Number(props.audio.value)}
            onChange={(_, value) => props.audio.value = value.toString()}/>
  </Box>
})
