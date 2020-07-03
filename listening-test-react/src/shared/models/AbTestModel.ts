import {AudioFileModel} from "./AudioFileModel";
import {SurveyControlModel} from "./SurveyControlModel";
import {BasicTestModel} from "./BasicTestModel";

export interface AbTestModel extends BasicTestModel{
  _id?: { $oid: string };
  userId?: number;
  createdAt?: { $date: Date };
  modifiedAt?: { $date: Date };
  name: string;
  description: string;
  responses?: [];

  survey: SurveyControlModel[];
  examples: AbExampleModel[];
}

export interface AbExampleModel {
  // New field for more flexibility
  questions: SurveyControlModel[];
  tags?: string;
  // The answer is the value of audio
  audios: AudioFileModel[];
  audioRef?: AudioFileModel;
}
