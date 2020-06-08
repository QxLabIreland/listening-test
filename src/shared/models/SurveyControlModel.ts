export interface SurveyControlModel {
  type: SurveyControlType;
  question: string;
  options?: string[];
  value?: any;
}

export enum SurveyControlType {
  text,
  radio,
  checkbox,
}
