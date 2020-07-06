import {TestItemType} from "../ReactEnums";
import {SurveyControlModel} from "./SurveyControlModel";
import {ItemExampleModel} from "./ItemExampleModel";

export interface BasicTestModel {
  _id?: { $oid: string };
  userId?: number;
  name: string;
  description: string;
  createdAt?: { $date: Date };
  modifiedAt?: { $date: Date };
  // This is the field show how many responses this test have
  responses?: [];

  items: TestItemModel[];
}

export interface TestItemModel {
  type: TestItemType;
  // The label for this example. Normally on the header of a card.
  label?: string;
  questionControl?: SurveyControlModel;
  example?: ItemExampleModel;
}
