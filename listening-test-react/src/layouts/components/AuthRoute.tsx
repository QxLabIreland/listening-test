import React, {PropsWithChildren, useContext} from "react";
import {Redirect, Route} from "react-router-dom";
import {useUserAuthResult} from "../../shared/ReactHooks";
import {CurrentUser} from "../../shared/ReactContexts";
import Loading from "./Loading";

export default function AuthRoute(props: PropsWithChildren<any>) {
  const {children, permission, ...rest} = props;
  const userAuthResult = useUserAuthResult(permission);
  const {currentUser} = useContext(CurrentUser);

  return <Route {...rest} render={({location}) =>
    // If current is undefined (data haven't come yet)
    currentUser === undefined ? <Loading/> :
      userAuthResult ? children : <Redirect to={{pathname: "/sign-in", state: {from: location}}}/>
  }/>
}
