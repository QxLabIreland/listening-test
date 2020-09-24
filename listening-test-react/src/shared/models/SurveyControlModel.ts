import {SurveyControlType} from "./EnumsAndTypes";

export interface SurveyControlModel {
  type: SurveyControlType;
  question: string;
  options?: string[];
  value: any;
  // Setting options
  required?: boolean;
  disabled?: boolean;
  // A mapping allows subject to skip some question
  // value equals: undefined or '': No mapping. [uuid]: Go to this question
  gotoQuestionMapping?: {[key: number]: string}
}

export interface GotoQuestionItemModel {
  id: string;
  title: string;
}

