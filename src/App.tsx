import React, {Suspense, useState} from 'react';
import Loading from "./shared/components/Loading";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import SurveyContainer from "./layouts/SurveyContainer";
import AppBarDrawer from "./layouts/AppBarDrawer/AppBarDrawer";
import NotFoundView from "./layouts/NotFoundView";
import PublicMain from "./layouts/PublicMain";
import XsrfAuth from "./shared/components/XsrfAuth";
import GlobalDialogProvider from "./shared/providers/GlobalDialogProvider";

export default function App() {

  return (
    <GlobalDialogProvider>
      <XsrfAuth/>
      <BrowserRouter>
        <Suspense fallback={<Loading/>}>
          <Switch>
            <Route path='/task' component={SurveyContainer}/>
            {/*Dashboard administration pages*/}
            <Route path="/user" component={AppBarDrawer}/>
            {/*Outside pages*/}
            <Route path="/not-found" component={NotFoundView}/>
            <Route path="/" component={PublicMain}/>
          </Switch>
        </Suspense>
      </BrowserRouter>
    </GlobalDialogProvider>
  );
}

