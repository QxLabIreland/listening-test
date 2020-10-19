import React, {FunctionComponent, ReactNode} from "react";
import {TestUrl} from "../../shared/models/EnumsAndTypes";
import {AbTestItemExampleCard} from "../audio/AbTest/AbTestItemExampleCard";
import {HearingTestItemExampleCard} from "../audio/HearingTest/HearingTestItemExampleCard";
import {AudioTestItemTrainingCard} from "../audio/AudioTestItemTrainingCard";
import {BasicExampleModel} from "../../shared/models/BasicTaskModel";
import {AcrTestItemExampleCard} from "../audio/AcrTest/AcrTestItemExampleCard";
import {ImageLabelingExampleItem} from "../image/ImageLabeling/ImageLabelingExampleItem";
import {ImageAbExampleItem} from "../image/ImageAb/ImageAbExampleItem";

/** The purpose of this file is to simplify the code, because there are lots of places using this type and props */
export type TestItemExampleCardProps = {
  example: BasicExampleModel, title: ReactNode, action: ReactNode, collapsed?: boolean
}
export type TestItemExampleCardType = FunctionComponent<TestItemExampleCardProps>

// Switch different card through 'testType'
export function overrideExampleItem(testUrl: TestUrl): TestItemExampleCardType {
  switch (testUrl) {
    case "ab-test":
      return AbTestItemExampleCard
    case "acr-test":
    case "mushra-test":
      return AcrTestItemExampleCard
    case "hearing-test":
      return HearingTestItemExampleCard
    case "image-labeling":
      return ImageLabelingExampleItem
    case "image-ab":
      return ImageAbExampleItem
    case "video-labeling":
      return (props) => <ImageLabelingExampleItem {...props} type="video"/>
    case "video-ab":
      return (props) => <ImageAbExampleItem {...props} mediaType="video"/>
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
      return AudioTestItemTrainingCard
    default:
      return null;
  }
}
