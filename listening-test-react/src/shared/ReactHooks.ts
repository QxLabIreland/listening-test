import {RefObject, useEffect, useRef, useState} from "react";

export function useScrollToView(viewRef: RefObject<any> = null) {
  // Scroll properties
  const [isUpdated, setIsUpdated] = useState<boolean>(null);

  useEffect(() => {
    if (viewRef && viewRef.current && isUpdated !== null){
      viewRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }, [isUpdated])

  const scrollToView = (ref: RefObject<any> = null) => {
    if (ref) viewRef = ref;
    setIsUpdated(!isUpdated);
  }

  return {scrollToView}
}

