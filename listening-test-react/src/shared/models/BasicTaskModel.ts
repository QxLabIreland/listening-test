import {UserModel} from "./UserModel";
import {TestItemType} from "./EnumsAndTypes";
import {SurveyControlModel} from "./SurveyControlModel";

export interface TestSettingsModel {
  isIndividual?: boolean;
  isTimed?: boolean;
}
/** Those basic models should not be used directly, except shared component. */
export interface BasicTaskModel {
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
  items: BasicTaskItemModel[];
  settings?: TestSettingsModel;
}

export interface BasicTaskItemModel {
  id: string;
  type: TestItemType;
  // The label for this example. Normally on the header of a card.
  title?: string;
  questionControl?: SurveyControlModel;
  example?: BasicExampleModel;
  // Time for users staying at this item.
  time?: number;
  // If the card expanded or not
  collapsed?: boolean;
  // TODO Section header settings
  // sectionSettings?: {randomQuestions?: boolean};
}

export interface BasicExampleModel {
  // New field for more flexibility
  fields: SurveyControlModel[];
  tags?: string;
  medias: BasicFileModel[];
  // The answer is the value of audio
  mediaRef?: BasicFileModel;
  // Settings make example play specific times
  settings?: any;
}

export interface BasicFileModel {
  filename: string | null;
  src: string | null;
  tags?: string;
  value: string;
  // Additional attributes to identify which one is active for subject
  isActive?: boolean;
  settings?: any;
}
