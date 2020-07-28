import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {TestItemType} from "../../shared/models/EnumsAndTypes";
import {RenderSurveyControl, surveyControlValidateError} from "../../shared/components/RenderSurveyControl";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import Grid from "@material-ui/core/Grid";
import {AudioButton, AudioController, useAudioPlayer} from "../../shared/components/AudiosPlayer";
import {RenderSurveyTraining} from "../components/RenderSurveyTraining";

export function questionedExValidateError(item: TestItemModel): string {
  if (!item) return null;
  if (item.type === TestItemType.example) {
    // Make sure ab test questions have been answered
    for (const a of item.example.fields) {
      const error = surveyControlValidateError(a);
      if (error) return error;
    }
    return null;
  }
  else return null;
}

export const AbSurveyRenderItem = observer(function (props: { item: TestItemModel, active?: boolean }) {
  const {item, ...rest} = props;
  switch (item.type) {
    case TestItemType.question:
      return <RenderSurveyControl control={item.questionControl} {...rest}/>
    case TestItemType.example:
      return <RenderQuestionedExample value={item.example} {...rest}/>;
    case TestItemType.training:
      return <RenderSurveyTraining value={item.example} {...rest}/>;
    default:
      return null;
  }
})

const RenderQuestionedExample = observer(function (props: { value: ItemExampleModel, active?: boolean }) {
  const {value, active} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, onTimeUpdate, onPlay, onPause} = useAudioPlayer(value.audios, value.audioRef);

  useEffect(() => {
    if (active === false) onPause();
  }, [active]);

  return <Grid container spacing={3}>

    {value.audios.map((v, i) => <Grid item key={i}>
      <AudioButton ref={refs[i]} audio={v} onPlay={onPlay} onPause={onPause} settings={value.settings}
                   onTimeUpdate={i === 0 ? onTimeUpdate : undefined}>{i + 1}</AudioButton>
      {/*{isDevMode() && <span>{refs[i].current?.currentTime}</span>}*/}
    </Grid>)}

    {/*Reference*/}
    {value.audioRef && <Grid item>
      <AudioButton ref={sampleRef} audio={value.audioRef} onPlay={onPlay} onPause={onPause}>Ref</AudioButton>
      {/*{isDevMode() && <span>{sampleRef?.current?.currentTime}</span>}*/}
    </Grid>}

    {value.fields?.map((value, i) => <Grid item xs={12} key={i}>
      <RenderSurveyControl control={value}/>
    </Grid>)}

    <Grid item xs={12}>
      <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}/>
    </Grid>
  </Grid>
})
