import {BasicTestModel, TestItemModel} from "./models/BasicTestModel";
import {SurveyControlType, TestItemType} from "./models/EnumsAndTypes";
import {SurveyControlModel} from "./models/SurveyControlModel";
import {ItemExampleModel} from "./models/ItemExampleModel";

function validatePlayedOnceError(example: ItemExampleModel): string {
  if (!example.settings?.requireClipEnded) return null;
  for (const a of example.audios) {
    if (!a.playedOnce) return 'Please fully listen to these clips'
  }
  return null;
}

export function surveyControlValidateError(control: SurveyControlModel): string {
  // Pass description type
  if (control.type === SurveyControlType.description) return null;
  // Required checking
  if (control.required) return control.value ? null : `${control.question} is required. You must answer this question to continue`;
  else return null;
}

export function questionedExValidateError(item: TestItemModel): string {
  if (!item) return null;
  else if (item.type === TestItemType.question) return surveyControlValidateError(item.questionControl);
  else if (item.type === TestItemType.example) {
    // Make sure ab test questions have been answered
    for (const a of item.example.fields) {
      const error = surveyControlValidateError(a);
      if (error) return error;
    }
    // Audio validation
    return validatePlayedOnceError(item.example);
  } else if (item.type === TestItemType.training) return validatePlayedOnceError(item.example);
  else return null;
}

export function sliderItemValidateError(item: TestItemModel): string {
  if (item == null) return null;
  else if (item.type === TestItemType.question) return surveyControlValidateError(item.questionControl);
  else if (item.type === TestItemType.example) {
    for (const a of item.example.audios) {
      if (item.example.settings?.requireClipEnded && !a.playedOnce) return 'Please fully listen to these clips'
      if (!a.value) return 'You must complete this example to continue'
    }
    return null;
  } else if (item.type === TestItemType.training) return validatePlayedOnceError(item.example);
  else return null;
}

export function testItemsValidateError(tests: BasicTestModel) {
  for (const item of tests.items) {
    if (item.example && (!item.example.audios || item.example.audios.length < 1)) {
      return 'Please add at least one audio for audio uploading example card'
    }
  }
  return null;
}
