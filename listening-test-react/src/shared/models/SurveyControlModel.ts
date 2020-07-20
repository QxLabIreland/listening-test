import {SurveyControlType} from "./EnumsAndTypes";

export interface SurveyControlModel {
  type: SurveyControlType;
  question: string;
  options?: string[];
  value: any;
  required?: boolean;
  otherOption?: boolean;
}
