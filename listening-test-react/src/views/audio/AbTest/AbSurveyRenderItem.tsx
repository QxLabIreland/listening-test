import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {AudioExampleModel, AudioTestItemModel} from "../../../shared/models/AudioTestModel";
import {TestItemType} from "../../../shared/models/EnumsAndTypes";
import {RenderSurveyControl} from "../../../shared/components/RenderSurveyControl";
import Grid from "@material-ui/core/Grid";
import {AudioButton, AudioController, useAudioPlayer} from "../../../shared/web-audio/AudiosPlayer";
import {RenderTraining} from "../../components/RenderTraining";
import {AudioLoading, useAllAudioReady} from "../../../shared/web-audio/AudiosLoading";
import {AudioSectionLoopingController} from "../../../shared/web-audio/AudioSectionLoopingController";
import {observable} from "mobx";
import {useRandomizedAudio} from "../../../shared/CustomHooks";

const alphabetList = Array.apply(undefined, Array(26)).map(function (x, y) {
  return String.fromCharCode(y + 65);
}).join('');

export const AbSurveyRenderItem = observer(function (props: { item: AudioTestItemModel, active?: boolean }) {
  const {item, ...rest} = props;
  switch (item.type) {
    case TestItemType.question:
      return <RenderSurveyControl control={item.questionControl} {...rest}/>
    case TestItemType.example:
      return <RenderQuestionedExample value={item.example} {...rest}/>;
    case TestItemType.training:
      return <RenderTraining value={item.example} {...rest}/>;
    default:
      return null;
  }
})

const RenderQuestionedExample = observer(function (props: { value: AudioExampleModel, active?: boolean }) {
  const {value, active} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, handleTimeUpdate, handlePlay, handlePause, handleEnded} = useAudioPlayer(value.medias, value.mediaRef, value);
  const loading = useAllAudioReady(value.mediaRef ? [...refs, sampleRef] : refs);
  const allRefs = value.mediaRef ? [...refs, sampleRef] : refs;
  const [onTimeUpdate, setOnTimeUpdate] = useState<() => void>();
  // Create empty slots for randomized audios

  useEffect(() => {
    if (active === false) handlePause();
  }, [active]);

  return <> <AudioLoading showing={loading}/>
    <Grid container spacing={3} style={{display: loading ? 'none' : 'flex'}}>

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
        <RenderSurveyControl control={value}/>
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
