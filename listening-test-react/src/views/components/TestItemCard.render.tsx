import {observer} from "mobx-react";
import {AudioExampleModel, AudioFileModel, AudioTestItemModel} from "../../shared/models/AudioTestModel";
import {TestItemType, TestUrl} from "../../shared/models/EnumsAndTypes";
import {RenderSurveyControl} from "../../shared/components/RenderSurveyControl";
import {RenderTraining} from "./RenderTraining";
import React, {useEffect, useState} from "react";
import {RenderQuestionedExample} from "../audio/AbTest/RenderQuestionedExample";
import {AcrRatingBar} from "../audio/AcrTest/AcrRatingBar";
import {MusharaRatingBar} from "../audio/Mushra/MusharaRatingBar";
import {RenderVolumeExample} from "../audio/HearingTest/RenderVolumeExample";
import {ImageLabelingExampleRender} from "../image/ImageLabeling/ImageLabelingRenderItem";
import {ImageAbExampleRender} from "../image/ImageAb/ImageAbRenderItem";
import {VideoLabelingExampleRender} from "../video/VideoLabeling/VideoLabelingRenderItem";
import {VideoAbExampleRender} from "../video/VideoAb/VideoAbRenderItem";
import {AudioButton, AudioController, useAudioPlayer} from "../../shared/web-audio/AudiosPlayer";
import {AudioLoading, useAllAudioReady} from "../../shared/web-audio/AudiosLoading";
import {useRandomization} from "../../shared/CustomHooks";
import Grid from "@material-ui/core/Grid";
import {ratingAreaStyle} from "../SharedStyles";
import {AudioSectionLoopingController} from "../../shared/web-audio/AudioSectionLoopingController";

export const TestItemCardRender = observer(function (props: { item: AudioTestItemModel, testUrl: TestUrl, active?: boolean }) {
  const {item, testUrl, ...rest} = props;

  // Switch to right rendering item
  const renderItemByTestUrl = () => {
    switch (testUrl) {
      case "ab-test":
        return <RenderQuestionedExample value={item.example} {...rest}/>;
      case "audio-labeling": // Only use training render of acr
      case "acr-test":
        return <RenderRatingExample value={item.example} RatingBar={AcrRatingBar} {...rest}/>
      case "mushra-test":
        return <RenderRatingExample value={item.example} RatingBar={MusharaRatingBar} {...rest}/>;
      case "hearing-test":
        return <RenderVolumeExample value={item.example} {...rest}/>;
      case "image-labeling":
        return <ImageLabelingExampleRender {...props}/>
      case "image-ab":
        return <ImageAbExampleRender {...props}/>
      case "video-labeling":
        return <VideoLabelingExampleRender {...props}/>
      case "video-ab":
        return <VideoAbExampleRender {...props}/>
      default:
        return null;
    }
  };
  switch (item.type) {
    case TestItemType.question:
      return <RenderSurveyControl control={item.questionControl} {...rest}/>
    case TestItemType.example:
      return renderItemByTestUrl();
    case TestItemType.training:
      return <RenderTraining value={item.example} {...rest}/>;
    default:
      return null;
  }
});

const RenderRatingExample = observer(function (props: { value: AudioExampleModel, RatingBar: (props: { audio: AudioFileModel }) => JSX.Element, active?: boolean }) {
  const {value, RatingBar, active} = props;
  // This is a custom hook that expose some functions for AudioButton and Controller
  const {refs, sampleRef, currentTime, handleTimeUpdate, handlePlay, handlePause, handleEnded} = useAudioPlayer(value.medias, value.mediaRef, value);
  const allRefs = value.mediaRef ? [...refs, sampleRef] : refs;
  const loading = useAllAudioReady(allRefs);
  // An event for setting Time update method
  const [onTimeUpdate, setOnTimeUpdate] = useState<() => void>();
  // Create empty slots for randomized audios
  const randomAudios = useRandomization(value.medias, active && value.settings?.randomMedia);

  useEffect(() => {
    if (active === false) handlePause();
  }, [active]);

  return <> <AudioLoading showing={loading}/>
    <Grid container spacing={3} style={{display: loading ? 'none' : 'flex'}}>
      {value.fields?.map((value, i) => <Grid item xs={12} key={i}>
        <RenderSurveyControl control={value}/>
      </Grid>)}

      {randomAudios.map((v, i) => <Grid item key={i} style={ratingAreaStyle}>
        <RatingBar audio={v}/>
        <AudioButton ref={refs[i]} audio={v} onPlay={handlePlay} onPause={handlePause}
                     onEnded={i === 0 ? handleEnded : undefined}
                     onTimeUpdate={i === 0 ? onTimeUpdate ? onTimeUpdate : handleTimeUpdate : undefined}>{i + 1}</AudioButton>
        {/*{isDevMode() && <span>{refs[i].current?.currentTime}</span>}*/}
      </Grid>)}

      {/*Reference*/}
      {value.mediaRef && <Grid item style={ratingAreaStyle}>
        <AudioButton ref={sampleRef} audio={value.mediaRef} onPlay={handlePlay} onPause={handlePause}>Ref</AudioButton>
        {/*{isDevMode() && <span>{sampleRef?.current?.currentTime}</span>}*/}
      </Grid>}

      <Grid item xs={12}>
        <AudioController refs={refs} sampleRef={sampleRef} currentTime={currentTime}
                         disabled={value.settings?.disablePlayerSlider}/>
        {value.settings?.sectionLooping &&
        <AudioSectionLoopingController setTimeUpdate={f => setOnTimeUpdate(f)} refs={allRefs}
                                       currentTime={currentTime}/>}
      </Grid>
    </Grid>
  </>
});

