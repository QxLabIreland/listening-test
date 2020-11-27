import {observer} from "mobx-react";
import {TestItemType, TestUrl} from "../../shared/models/EnumsAndTypes";
import {SurveyControlRender} from "../../shared/components/SurveyControl.render";
import React from "react";
import {AbTestItemExampleRender} from "../audio/AbTest/AbTestItemExample.render";
import {HearingTestItemExampleRender} from "../audio/HearingTest/HearingTestItemExample.render";
import {ImageLabelingExampleRender} from "../image/ImageLabeling/ImageLabelingExample.render";
import {ImageAbExampleRender} from "../image/ImageAb/ImageAbExample.render";
import {VideoLabelingExampleRender} from "../video/VideoLabeling/VideoLabelingExample.render";
import {VideoAbExampleRender} from "../video/VideoAb/VideoAbExample.render";
import {MushraTestItemExampleRender} from "../audio/Mushra/MushraTestItemExample.render";
import {AudioTestItemTraining} from "../audio/AudioTestItemTraining.render";
import {AcrTestItemExampleRender} from "../audio/AcrTest/AcrTestItemExample.render";
import {BasicTaskItemModel} from "../../shared/models/BasicTaskModel";

export const TestItemCardRender = observer(function (props: { item: BasicTaskItemModel, testUrl: TestUrl, active?: boolean, previewMode?:boolean }) {
  const {item, testUrl, ...rest} = props;

  // Switch to right rendering item
  const renderItemByTestUrl = () => {
    switch (testUrl) {
      case "ab-test":
        return <AbTestItemExampleRender value={item.example} {...rest}/>;
      case "acr-test":
        return <AcrTestItemExampleRender example={item.example} {...rest}/>
      case "audio-labeling": // Only use training render of acr
      case "mushra-test":
        return <MushraTestItemExampleRender example={item.example} {...rest}/>;
      case "hearing-test":
        return <HearingTestItemExampleRender value={item.example} {...rest}/>;
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
      return <SurveyControlRender control={item.questionControl} {...rest}/>
    case TestItemType.example:
      return renderItemByTestUrl();
    case TestItemType.training:
      return <AudioTestItemTraining value={item.example} {...rest}/>;
    default:
      return null;
  }
});

