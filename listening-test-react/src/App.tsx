import React, {Suspense} from 'react';
import Loading from "./shared/components/Loading";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import SurveyContainer from "./layouts/SurveyContainer";
import AppBarDrawer from "./layouts/AppBarDrawer/AppBarDrawer";
import NotFoundView from "./layouts/NotFoundView";
import PublicContainer from "./layouts/PublicContainer";
import XsrfAuth from "./shared/providers/XsrfAuth";
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
            <Route path="/" component={PublicContainer}/>
          </Switch>
        </Suspense>
      </BrowserRouter>
    </GlobalDialogProvider>
  );
}

