import {AudioExampleModel} from "./models/AudioTestModel";
import {TestItemType} from "./models/EnumsAndTypes";
import {SurveyControlModel} from "./models/SurveyControlModel";
import {BasicTaskItemModel, BasicTaskModel} from "./models/BasicTaskModel";

/** Audio setting playback setting validation */
export function validatePlayedOnceError(example: AudioExampleModel): string {
  if (!example.settings?.requireClipEnded) return null;
  if (!example.playedOnce) return 'Please fully listen to these clips'
  return null;
}

export function surveyControlValidateError(control: SurveyControlModel): string {
  // Pass description type
  // if (control.type === SurveyControlType.description) return null;
  // Required checking
  if (control.required) return control.value ? null : `${control.question} is required. You must answer this question to continue`;
  else return null;
}

/** A validation method for an example item with questions. Normally for AB test */
export function questionedExValidateError(item: BasicTaskItemModel): string {
  if (!item) return null;
  else if (item.type === TestItemType.question) return surveyControlValidateError(item.questionControl);
  else if ((item.type === TestItemType.example || item.type === TestItemType.training) && item.example.fields) {
    // Make sure ab test questions have been answered
    for (const a of item.example.fields) {
      const error = surveyControlValidateError(a);
      if (error) return error;
    }
    // Audio validation
    return validatePlayedOnceError(item.example);
  }
  else return null;
}
/** For an example item with a slider or a value field */
export function sliderItemValidateError(item: BasicTaskItemModel): string {
  if (item == null) return null;
  else if (item.type === TestItemType.question) return surveyControlValidateError(item.questionControl);
  else if (item.type === TestItemType.example) {
    // Map all audio and make sure played at least once and value is fill
    for (const a of item.example.medias) {
      delete a.isActive;
      if (!a.value) return 'You must complete this example to continue'
    }
    // Make sure internal questions have been answered
    for (const a of item.example.fields) {
      const error = surveyControlValidateError(a);
      if (error) return error;
    }
    return validatePlayedOnceError(item.example);
  } else if (item.type === TestItemType.training) return questionedExValidateError(item);
  else return null;
}

/** Check if the test or task has been completed (uploaded audio, no null field in audios) */
export function testItemsValidateIncomplete(tests: BasicTaskModel) {
  for (const item of tests.items) {
    // Make sure audios array exists. When length is 0, some of them are null, there will be error
    if (item.example && item.example.medias && (item.example.medias.length < 1 || item.example.medias.some(value => value == null))) {
      return "Your haven't added an audio or filled placeholders for every items. Please fill them and try again."
    }
  }
  return null;
}
