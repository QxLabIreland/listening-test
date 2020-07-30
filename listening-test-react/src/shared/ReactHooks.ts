import {RefObject, useEffect, useState} from "react";
import {TestItemModel} from "./models/BasicTestModel";
import {AbSurveyRenderItem} from "../views/AbTest/AbSurveyRenderItem";
import {AcrSurveyRenderItem} from "../views/AcrTest/AcrSurveyRenderItem";
import {MushraSurveyRenderItem} from "../views/Mushra/MushraSurveyRenderItem";
import {HearingSurveyRenderItem} from "../views/HearingTest/HearingSurveyRenderItem";
import {questionedExValidateError, sliderItemValidateError} from "./ErrorValidators";
import {TestUrl} from "./models/EnumsAndTypes";

export function useScrollToView(viewRef: RefObject<any> = null) {
  // Scroll properties
  const [isUpdated, setIsUpdated] = useState<boolean>(null);

  useEffect(() => {
    if (viewRef && viewRef.current && isUpdated !== null) {
      viewRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }, [isUpdated])

  const scrollToView = (ref: RefObject<any> = null) => {
    if (ref) viewRef = ref;
    setIsUpdated(!isUpdated);
  }

  return {scrollToView}
}

export function useSurveyRenderItem(testUrl: TestUrl): { RenderedItem: (props: { item: TestItemModel, active?: boolean }) => JSX.Element, validateError: (item: TestItemModel) => string } {
  // Switch to right rendering item
  const renderItemByTestUrl = () => {
    switch (testUrl) {
      case "ab-test":
        return AbSurveyRenderItem
      case "acr-test":
        return AcrSurveyRenderItem
      case "mushra-test":
        return MushraSurveyRenderItem
      case "hearing-test":
        return HearingSurveyRenderItem
      default:
        return null;
    }
  }

  const validateError = () => {
    switch (testUrl) {
      case "ab-test":
        return questionedExValidateError;
      case "acr-test":
      case "mushra-test":
      case "hearing-test":
        return sliderItemValidateError;
      default:
        return null;
    }
  }
  return {RenderedItem: renderItemByTestUrl(), validateError: validateError()}
}
