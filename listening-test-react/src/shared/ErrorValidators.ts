import {BasicTestModel, TestItemModel} from "./models/BasicTestModel";
import {SurveyControlType, TestItemType} from "./models/EnumsAndTypes";
import {SurveyControlModel} from "./models/SurveyControlModel";
import {ItemExampleModel} from "./models/ItemExampleModel";

function validatePlayedOnceError(example: ItemExampleModel): string {
  if (!example.settings?.requireClipEnded) return null;
  if (!example.playedOnce) return 'Please fully listen to these clips'
  return null;
}

export function surveyControlValidateError(control: SurveyControlModel): string {
  // Pass description type
  if (control.type === SurveyControlType.description) return null;
  // Required checking
  if (control.required) return control.value ? null : `${control.question} is required. You must answer this question to continue`;
  else return null;
}

export function questionedExValidateError(item: TestItemModel, isAb?: boolean): string {
  if (!item) return null;
  else if (item.type === TestItemType.question) return surveyControlValidateError(item.questionControl);
  else if (item.type === TestItemType.example) {
    // Make sure ab test questions have been answered
    for (const a of item.example.fields) {
      const error = a.type === SurveyControlType.radio && isAb
        // If the type is radio and current check is ab test
        ? (a.required ? (a.value ? null : 'Please select a preference. You must answer this question to continue') : null)
        : surveyControlValidateError(a);
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
    // Map all audio and make sure played at least once and value is fill
    for (const a of item.example.audios) {
      if (!a.value) return 'You must complete this example to continue'
    }
    return validatePlayedOnceError(item.example);
  } else if (item.type === TestItemType.training) return validatePlayedOnceError(item.example);
  else return null;
}

export function testItemsValidateIncomplete(tests: BasicTestModel) {
  for (const item of tests.items) {
    // Audios array is null, length is 0, some of them are null
    if (item.example && (!item.example.audios || item.example.audios.length < 1 || item.example.audios.some(value => value == null))) {
      return "Your haven't added an audio or filled placeholders for every items. Please fill them and try again."
    }
  }
  return null;
}
