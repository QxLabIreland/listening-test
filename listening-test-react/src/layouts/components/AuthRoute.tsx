import React, {PropsWithChildren, useContext} from "react";
import {Redirect, Route} from "react-router-dom";
import {CurrentUser} from "../../shared/ReactContexts";

export default function AuthRoute(props: PropsWithChildren<any>) {
  const {children, ...rest} = props;
  const {currentUser} = useContext(CurrentUser);

  return <Route {...rest} render={({location}) =>
    currentUser !== null ? children : <Redirect to={{pathname: "/sign-in", state: {from: location}}}/>
  }/>
}

export function PermissionRoute(props: PropsWithChildren<{ permission: string }>) {
  const {children, permission, ...rest} = props;
  const {currentUser} = useContext(CurrentUser);

  const authenticate = (): boolean => {
    if (!currentUser) return currentUser !== null;
    // If user has permission to this page
    else return !!(permission && currentUser.permissions.includes(permission));
  }
  return <Route {...rest} render={({location}) =>
    authenticate() ? children : <Redirect to={{pathname: "/sign-in", state: {from: location}}}/>
  }/>
}
