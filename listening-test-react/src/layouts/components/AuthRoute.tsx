import React, {PropsWithChildren, useContext} from "react";
import {Redirect, Route} from "react-router-dom";
import {CurrentUser} from "../../shared/ReactContexts";
import {useUserAuthFun} from "../../shared/ReactHooks";

export default function AuthRoute(props: PropsWithChildren<any>) {
  const {children, permission, ...rest} = props;
  const authenticate = useUserAuthFun(permission);

  return <Route {...rest} render={({location}) =>
    authenticate() ? children : <Redirect to={{pathname: "/sign-in", state: {from: location}}}/>
  }/>
}
