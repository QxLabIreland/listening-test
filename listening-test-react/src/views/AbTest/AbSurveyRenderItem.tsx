import React, {useEffect} from "react";
import {observer} from "mobx-react";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {TestItemType} from "../../shared/models/EnumsAndTypes";
import {RenderSurveyControl} from "../../shared/components/RenderSurveyControl";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import Grid from "@material-ui/core/Grid";
import {AudioButton, AudioController, useAudioPlayer} from "../../shared/web-audio/AudiosPlayer";
import {RenderTraining} from "../components/RenderTraining";
import {AudioLoading, useAllAudioReady} from "../../shared/web-audio/AudiosLoading";

const alphabetList = Array.apply(undefined, Array(26)).map(function(x,y) { return String.fromCharCode(y + 65); }).join('');

export const AbSurveyRenderItem = observer(function (props: { item: TestItemModel, active?: boolean }) {
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

const RenderQuestionedExample = observer(function (props: { value: ItemExampleModel, active?: boolean }) {
  const {value, active} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, handleTimeUpdate, handlePlay, handlePause, handleEnded} = useAudioPlayer(value.audios, value.audioRef, value);
  const loading = useAllAudioReady(value.audioRef ? [...refs, sampleRef] : refs);

  useEffect(() => {
    if (active === false) handlePause();
  }, [active]);

  return <> <AudioLoading showing={loading}/>
    <Grid container spacing={3} style={{display: loading ? 'none' : 'flex'}}>

      {value.audios.map((v, i) => <Grid item key={i}>
        <AudioButton ref={refs[i]} audio={v} onPlay={handlePlay} onPause={handlePause} onEnded={i === 0 ? handleEnded : undefined}
                     onTimeUpdate={i === 0 ? handleTimeUpdate : undefined}>{value.fields[0]?.options[i] || alphabetList[i]}</AudioButton>
        {/*{isDevMode() && <span>{refs[i].current?.currentTime}</span>}*/}
      </Grid>)}

      {/*Reference*/}
      {value.audioRef && <Grid item>
        <AudioButton ref={sampleRef} audio={value.audioRef} onPlay={handlePlay} onPause={handlePause}>Ref</AudioButton>
        {/*{isDevMode() && <span>{sampleRef?.current?.currentTime}</span>}*/}
      </Grid>}

      {value.fields?.map((value, i) => <Grid item xs={12} key={i}>
        <RenderSurveyControl control={value}/>
      </Grid>)}

      <Grid item xs={12}>
        <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}/>
      </Grid>
    </Grid>
  </>
})
