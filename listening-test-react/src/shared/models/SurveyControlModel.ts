import {SurveyControlType} from "../ReactEnums";

export interface SurveyControlModel {
  type: SurveyControlType;
  question: string;
  options?: string[];
  value: any;
  required?: boolean;
  otherOption?: boolean;
}
