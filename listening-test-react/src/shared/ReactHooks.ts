import {useEffect, useLayoutEffect, useRef, useState} from "react";

export function useScrollToView() {
  // Scroll properties
  const viewRef = useRef(null);
  const [isUpdated, setIsUpdated] = useState<boolean>(null);

  useEffect(() => {
    if (viewRef.current && isUpdated !== null){
      viewRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }, [isUpdated])

  const scrollToView = () => {
    setIsUpdated(!isUpdated);
  }

  return {viewRef, scrollToView}
}

