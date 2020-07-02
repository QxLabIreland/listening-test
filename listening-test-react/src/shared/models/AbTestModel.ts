import {AudioFileModel} from "./AudioFileModel";
import {SurveyControlModel} from "./SurveyControlModel";

export interface AbTestModel {
  _id?: { $oid: string };
  userId?: number;
  survey: SurveyControlModel[];
  examples: AbExampleModel[];
  createdAt?: { $date: Date };
  modifiedAt?: { $date: Date };
  name: string;
  description: string;
  responses?: [];
}

export interface AbExampleModel {
  // New field for more flexibility
  questions: SurveyControlModel[];
  tags?: string;
  // The answer is the value of audio
  audios: AudioFileModel[];
  audioRef?: AudioFileModel;
}
