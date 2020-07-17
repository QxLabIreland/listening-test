import {TestItemType} from "../ReactEnumsAndTypes";
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
  // In list view, we may get rid of these fields
  items: TestItemModel[];
  settings?: TestSettingsModel;
}

export interface TestItemModel {
  id: string;
  type: TestItemType;
  // The label for this example. Normally on the header of a card.
  title?: string;
  questionControl?: SurveyControlModel;
  example?: ItemExampleModel;
  // Time for users staying at this item.
  time?: number;
}

export interface TestSettingsModel {
  isIndividual?: boolean;
  timing?: boolean;
}
