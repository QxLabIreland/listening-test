import {AudioFileModel} from "./AudioFileModel";
import {SurveyControlModel} from "./SurveyControlModel";

export interface AbTestModel {
  id: number;
  user_id?: number;
  survey: SurveyControlModel[] | string;
  examples: AudioExample[];
}

interface AudioExample {
  id: number;
  answer?: string;
  audioA: AudioFileModel,
  audioB: AudioFileModel,
  audioRef?: AudioFileModel
}
