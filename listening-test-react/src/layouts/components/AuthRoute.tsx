import React, {PropsWithChildren, useContext} from "react";
import {Redirect, Route} from "react-router-dom";
import {CurrentUser} from "../../shared/ReactContexts";
import Loading from "./Loading";
import H, {History} from "history";

export default function AuthRoute(props: PropsWithChildren<any>) {
  const {children, permission, ...rest} = props;
  const {currentUser} = useContext(CurrentUser);

  const authenticate = (location: H.Location<History.LocationState>) => {
    // No permission given, only valid if the user is logged in
    if (!permission) return !!currentUser ? children : <Redirect to={{pathname: "/sign-in", state: {from: location}}}/>;
    // If user has permission to this page
    else return currentUser?.permissions?.includes(permission) ? children :
      <Redirect to={{pathname: "/user", state: {from: location}}}/>;
  }

  return <Route {...rest} render={({location}) =>
    // If current is undefined (data haven't come yet)
    currentUser === undefined ? <Loading/> : authenticate(location)
  }/>
}

export function useUserAuthResult(permission?: string) {
  const {currentUser} = useContext(CurrentUser);

  // No permission given, only valid if the user is logged in
  if (!permission) return !!currentUser;
  // If user has permission to this page
  else return currentUser?.permissions?.includes(permission);
}
