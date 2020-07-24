import {SurveyControlModel} from "./SurveyControlModel";
import {BasicTestModel} from "./BasicTestModel";
import {ItemExampleModel} from "./ItemExampleModel";

export interface AbTestModel extends BasicTestModel{
  survey: SurveyControlModel[];
  examples: ItemExampleModel[];
}
