import React, {CSSProperties} from "react";
import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {TestItemType} from "../../shared/ReactEnumsAndTypes";
import {RenderSurveyControl} from "../components/RenderSurveyControl";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import Grid from "@material-ui/core/Grid";
import {AudioButton, AudioController, useAudioPlayer} from "../../shared/components/AudiosPlayer";
import {Box, Slider} from "@material-ui/core";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import {isDevMode} from "../../shared/ReactTools";

const RatingAreaStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end'
} as CSSProperties;

export const AcrSurveyRenderItem = observer(function (props: { item: TestItemModel }) {

  switch (props.item.type) {
    case TestItemType.question:
      return <RenderSurveyControl control={props.item.questionControl}/>
    case TestItemType.example:
      return <RenderRatingExample value={props.item.example}/>;
    case TestItemType.training:
      return <RenderRatingExample value={props.item.example} isTraining={true}/>;
    default:
      return null;
  }
})

const RenderRatingExample = observer(function (props: { value: ItemExampleModel, isTraining?: boolean }) {
  const {value, isTraining = false} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, handleTimeUpdate, ...restHandlers} = useAudioPlayer(value.audios, value.audioRef);

  return <Grid container spacing={3}>
    {value.fields?.map((value, i) => <Grid item xs={12} key={i}>
      <RenderSurveyControl control={value}/>
    </Grid>)}

    {value.audios.map((v, i) => <Grid item key={i} style={RatingAreaStyle}>
      {!isTraining && <AudioRatingBar audio={v}/>}
      <AudioButton ref={refs[i]} audio={v} {...restHandlers} settings={value.settings}
                   onTimeUpdate={i === 0 ? handleTimeUpdate : undefined}>{i + 1}</AudioButton>
      {isDevMode() && <span>{refs[i].current?.currentTime}</span>}
    </Grid>)}

    {/*Reference*/}
    {value.audioRef && <Grid item style={RatingAreaStyle}>
      <AudioButton ref={sampleRef} audio={value.audioRef} {...restHandlers}>Ref</AudioButton>
      {isDevMode() && <span>{sampleRef?.current?.currentTime}</span>}
    </Grid>}

    <Grid item xs={12}>
      <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}/>
    </Grid>
  </Grid>
})

export const AudioRatingBar = observer(function (props: { audio: AudioFileModel}) {
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
