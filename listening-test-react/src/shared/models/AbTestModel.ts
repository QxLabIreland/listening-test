import {SurveyControlModel} from "./SurveyControlModel";
import {BasicTestModel} from "./BasicTestModel";

export interface AbTestModel extends BasicTestModel{
  survey: SurveyControlModel[];
}
