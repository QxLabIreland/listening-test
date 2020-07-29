import {TestItemModel} from "./models/BasicTestModel";
import {SurveyControlType, TestItemType} from "./models/EnumsAndTypes";
import {SurveyControlModel} from "./models/SurveyControlModel";

export function surveyControlValidateError(control: SurveyControlModel): string {
  // Pass description type
  if (control.type === SurveyControlType.description) return null;
  // Required checking
  if (control.required) return control.value ? null : `${control.question} is required. You must answer this question to continue`;
  else return null;
}

export function questionedExValidateError(item: TestItemModel): string {
  if (!item) return null;
  if (item.type === TestItemType.example) {
    // Make sure ab test questions have been answered
    for (const a of item.example.fields) {
      const error = surveyControlValidateError(a);
      if (error) return error;
    }
    return null;
  } else return null;
}

export function sliderItemValidateError(item: TestItemModel): string {
  if (item == null) return null;
  else if (item.type === TestItemType.question) return surveyControlValidateError(item.questionControl);
  else if (item.type === TestItemType.example) {
    for (const a of item.example.audios) {
      if (!a.value) return 'You must complete this example to continue'
    }
    return null;
  } else return null;
}
