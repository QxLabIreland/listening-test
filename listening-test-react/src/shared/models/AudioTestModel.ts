import {BasicExampleModel, BasicFileModel, BasicTaskItemModel, BasicTaskModel} from "./BasicTaskModel";

export interface AudioTestModel extends BasicTaskModel{
  items: AudioTestItemModel[];
}

export interface AudioTestItemModel extends BasicTaskItemModel {
  example?: AudioExampleModel;
}

export interface AudioExampleModel extends BasicExampleModel {
  medias: AudioFileModel[];
  // The answer is the value of audio
  mediaRef?: AudioFileModel;
  // Settings make example play specific times
  settings?: AudioExampleSettingsModel;
  // To check if the example has been played once
  // TODO Move it into AudioFileModel and remember to delete them in validation
  playedOnce?: boolean;
}

export interface AudioExampleSettingsModel {
  loopTimes?: number;
  requireClipEnded?: boolean;
  sectionLooping?: boolean;
  disablePlayerSlider?: boolean;
  randomMedia?: boolean;
  fixLastInternalQuestion?: boolean;
}

export interface AudioFileModel extends BasicFileModel{
  settings?: AudioSettings;
}

export interface AudioSettings {
  frequency: number;
  initVolume: number;
}
