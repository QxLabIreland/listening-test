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
