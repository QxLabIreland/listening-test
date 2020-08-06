import {RefObject, useContext, useEffect, useState} from "react";
import {CurrentUser} from "./ReactContexts";

export function useScrollToView(viewRef: RefObject<any> = null) {
  // Scroll properties
  const [isUpdated, setIsUpdated] = useState<boolean>(null);

  useEffect(() => {
    if (viewRef && viewRef.current && isUpdated !== null) {
      viewRef.current.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
  }, [isUpdated])

  const scrollToView = (ref: RefObject<any> = null) => {
    if (ref) viewRef = ref;
    setIsUpdated(!isUpdated);
  }

  return {scrollToView}
}

export function useUserAuthResult(permission?: string) {
  const {currentUser} = useContext(CurrentUser);

  // No permission given, only valid if the user is logged in
  if (!permission) return !!currentUser;
  // If user has permission to this page
  else return currentUser?.permissions?.includes(permission);
}
