import React, {CSSProperties, useEffect} from "react";
import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {TestItemType} from "../../shared/models/EnumsAndTypes";
import {RenderSurveyControl} from "../../shared/components/RenderSurveyControl";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import Grid from "@material-ui/core/Grid";
import {AudioButton, AudioController, useAudioPlayer} from "../../shared/components/AudiosPlayer";
import {Box, Slider} from "@material-ui/core";
import {AudioFileModel} from "../../shared/models/AudioFileModel";
import Icon from "@material-ui/core/Icon";

export const HearingSurveyRenderItem = observer(function (props: { item: TestItemModel, active?: boolean }) {
  const {item, ...rest} = props;
  switch (item.type) {
    case TestItemType.question:
      return <RenderSurveyControl control={item.questionControl} {...rest}/>
    case TestItemType.example:
      return <RenderVolumeExample value={item.example} {...rest}/>;
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

const RenderVolumeExample = observer(function (props: { value: ItemExampleModel, active?: boolean }) {
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
      <AudioVolumeBar audio={v}/>
      <AudioButton ref={refs[i]} audio={v} onPlay={onPlay} onPause={onPause} settings={value.settings}
                   onTimeUpdate={i === 0 ? onTimeUpdate : undefined}>{i + 1}</AudioButton>
    </Grid>)}

    {/*Reference*/}
    {value.audioRef && <Grid item style={RatingAreaStyle}>
      <AudioButton ref={sampleRef} audio={value.audioRef} onPlay={onPlay} onPause={onPause}>Ref</AudioButton>
    </Grid>}

    <Grid item xs={12}>
      <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}/>
    </Grid>
  </Grid>
})

const AudioVolumeBar = observer(function (props: { audio: AudioFileModel }) {

  return <Box mb={2} mt={2} style={{height: 200}}>
    {/*<Grid container spacing={1} direction="column" justify="space-between">
      <Grid item><Icon>volume_down</Icon></Grid>
      <Grid item>

      </Grid>
      <Grid item><Icon>volume_up</Icon></Grid>
    </Grid>*/}
    <Slider orientation="vertical" aria-labelledby="vertical-slider" min={0} max={100} step={1} valueLabelDisplay="auto"
            defaultValue={props.audio.settings?.initVolume}
            onChange={(_, nv) => props.audio.value = (+nv / 100).toString()}/>

  </Box>
})
