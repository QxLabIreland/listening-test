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
  // Brief comment of choice
  question: string;
  tags?: string;
  comment?: string;
  // The answer is the name of audio
  answer?: string;
  audioA: AudioFileModel;
  audioB: AudioFileModel;
  audioRef?: AudioFileModel;
}
