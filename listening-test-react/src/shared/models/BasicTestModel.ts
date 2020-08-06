import {TestItemType} from "./EnumsAndTypes";
import {SurveyControlModel} from "./SurveyControlModel";
import {ItemExampleModel} from "./ItemExampleModel";
import {UserModel} from "./UserModel";

export interface BasicTestModel {
  _id?: { $oid: string };
  userId?: number;
  name: string;
  createdAt?: { $date: Date };
  modifiedAt?: { $date: Date };
  // Template fields
  isTemplate?: boolean;
  creator?: UserModel;
  // This is the field show how many responses this test have
  responseNum?: number;
  // In list view, we may get rid of these fields
  description: string;
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
  // If the card expanded or not
  collapsed?: boolean;
}

export interface TestSettingsModel {
  isIndividual?: boolean;
  isTimed?: boolean;
}
