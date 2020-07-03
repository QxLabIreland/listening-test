import {TestItemType} from "../ReactEnums";
import {SurveyControlModel} from "./SurveyControlModel";
import {ItemExampleModel} from "./ItemExampleModel";

export interface TestItemModel {
  type: TestItemType;
  header?: string;
  questionControl?: SurveyControlModel;
  example?: ItemExampleModel;
}
