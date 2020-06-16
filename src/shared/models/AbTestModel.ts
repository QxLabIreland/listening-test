import {AudioFileModel} from "./AudioFileModel";
import {SurveyControlModel} from "./SurveyControlModel";

export interface AbTestModel {
  _id?: { $oid: string };
  user_id?: number;
  survey: SurveyControlModel[] | string;
  examples: AudioExample[];
  createdAt?: { $date: Date };
  name: string;
}

interface AudioExample {
  answer?: string;
  audioA: AudioFileModel,
  audioB: AudioFileModel,
  audioRef?: AudioFileModel
}
