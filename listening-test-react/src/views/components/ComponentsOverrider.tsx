import React, {FunctionComponent, ReactNode} from "react";
import {TestUrl} from "../../shared/models/EnumsAndTypes";
import {AbTestItemExampleCard} from "../audio/AbTest/AbTestItemExampleCard";
import {HearingTestItemExampleCard} from "../audio/HearingTest/HearingTestItemExampleCard";
import {AudioTestItemTraining} from "../audio/AudioTestItemTraining";
import {BasicExampleModel} from "../../shared/models/BasicTaskModel";
import {MushraTestItemExampleCard} from "../audio/Mushra/MushraTestItemExampleCard";
import {ImageLabelingExampleItem} from "../image/ImageLabeling/ImageLabelingExampleItem";
import {ImageAbExampleItem} from "../image/ImageAb/ImageAbExampleItem";
import {AcrTestItemExampleCard} from "../audio/AcrTest/AcrTestItemExampleCard";
import {TestDetailView} from "../shared-views/TestDetailView";
import {AbAddItemButtonGroup} from "../audio/AbTest/AbAddItemButtonGroup";
import {AcrAddItemButtonGroup} from "../audio/AcrTest/AcrAddItemButtonGroup";
import {MushraAddItemButtonGroup} from "../audio/Mushra/MushraAddItemButtonGroup";
import {HearingAddItemButtons} from "../audio/HearingTest/HearingAddItemButtons";
import {AudioLabelingButtonGroup} from "../audio/AudioLabeling/AudioLabelingButtonGroup";
import {ImageLabelingButtonGroup} from "../image/ImageLabeling/ImageLabelingButtonGroup";
import {ImageAbButtonGroup} from "../image/ImageAb/ImageAbButtonGroup";
import {VideoLabelingButtonGroup} from "../video/VideoLabeling/VideoLabelingButtonGroup";
import {VideoAbButtonGroup} from "../video/VideoAb/VideoAbButtonGroup";
/** The purpose of this file is to simplify the code, because there are lots of places using this type and props */
export type TestItemExampleCardType = FunctionComponent<{
  example: BasicExampleModel, title: ReactNode, action: ReactNode, collapsed?: boolean
}>

// Switch different card through 'testType'
export function overrideExampleItem(testUrl: TestUrl): TestItemExampleCardType {
  switch (testUrl) {
    case "ab-test":
      return AbTestItemExampleCard;
    case "acr-test":
      return AcrTestItemExampleCard;
    case "mushra-test":
      return MushraTestItemExampleCard;
    case "hearing-test":
      return HearingTestItemExampleCard;
    case "image-labeling":
      return ImageLabelingExampleItem;
    case "image-ab":
      return ImageAbExampleItem;
    case "video-labeling":
      return (props) => <ImageLabelingExampleItem {...props} type="video"/>;
    case "video-ab":
      return (props) => <ImageAbExampleItem {...props} mediaType="video"/>;
    default:
      return null;
  }
}

export function overrideTrainingItem(testUrl: TestUrl): TestItemExampleCardType {
  switch (testUrl) {
    case "ab-test":
    case "acr-test":
    case "mushra-test":
    case "hearing-test":
    case "audio-labeling": // Special task type, using training as example
      return AudioTestItemTraining
    default:
      return null;
  }
}

// Switch different card and button group through 'testType'
export function TestDetailViewWrapper({testUrl}: { testUrl: TestUrl }) {
  switch (testUrl) {
    case "ab-test":
      return <TestDetailView testUrl={testUrl} ButtonGroup={AbAddItemButtonGroup}/>
    case "acr-test":
      return <TestDetailView testUrl={testUrl} ButtonGroup={AcrAddItemButtonGroup}/>
    case "mushra-test":
      return <TestDetailView testUrl={testUrl} ButtonGroup={MushraAddItemButtonGroup}/>
    case "hearing-test":
      return <TestDetailView testUrl={testUrl} ButtonGroup={HearingAddItemButtons}/>
    case "audio-labeling":
      return <TestDetailView testUrl={testUrl} ButtonGroup={AudioLabelingButtonGroup}/>
    case "image-labeling":
      return <TestDetailView testUrl={testUrl} ButtonGroup={ImageLabelingButtonGroup}/>
    case "image-ab":
      return <TestDetailView testUrl={testUrl} ButtonGroup={ImageAbButtonGroup}/>
    case "video-labeling":
      return <TestDetailView testUrl={testUrl} ButtonGroup={VideoLabelingButtonGroup}/>
    case "video-ab":
      return <TestDetailView testUrl={testUrl} ButtonGroup={VideoAbButtonGroup}/>
    default:
      return null;
  }
}
