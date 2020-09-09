import {SurveyControlType} from "./EnumsAndTypes";

export interface SurveyControlModel {
  type: SurveyControlType;
  question: string;
  options?: string[];
  value: any;
  // Setting options
  required?: boolean;
  disabled?: boolean;
  gotoQuestionMapping?: {[key: number]: string}
}

export interface GotoQuestionItemModel {
  id: string;
  title: string;
}

// undefined/'': No mapping, 'abort': Abort, uuid: Go to this question
export const gotoQuestionAbortValue = 'abort';
