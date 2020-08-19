import {SurveyControlModel} from "./SurveyControlModel";
import {AudioFileModel} from "./AudioFileModel";

export interface ItemExampleModel {
  audios: AudioFileModel[];
  // The answer is the value of audio
  audioRef?: AudioFileModel;
  // New field for more flexibility
  fields: SurveyControlModel[];
  tags?: string;
  // Settings make example play specific times
  settings?: ItemExampleSettingsModel;
  // To check if the example has been played once
  playedOnce?: boolean;
}

export interface ItemExampleSettingsModel {
  loopTimes?: number;
  requireClipEnded?: boolean;
  sectionLooping?: boolean;
}
