import React, {Suspense} from 'react';
import Loading from "./layouts/components/Loading";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import SurveyContainer from "./layouts/SurveyContainer";
import {AppBarDrawer} from "./layouts/AppBarDrawer/AppBarDrawer";
import PublicContainer from "./layouts/PublicContainer";
import XsrfAuthUserProvider from "./shared/providers/XsrfAuthUserProvider";
import GlobalDialogProvider from "./shared/providers/GlobalDialogProvider";
import GlobalSnackbarProvider from "./shared/providers/GlobalSnackbarProvider";
import AuthRoute from "./layouts/components/AuthRoute";

export default function App() {

  return (
    <GlobalSnackbarProvider>
      <GlobalDialogProvider>
        <XsrfAuthUserProvider>
          <BrowserRouter>
            <Suspense fallback={<Loading/>}>
              <Switch>
                <Route path='/task' component={SurveyContainer}/>
                {/*Dashboard administration pages*/}
                <AuthRoute path="/user"><AppBarDrawer/></AuthRoute>
                {/*Outside pages*/}
                <Route path="/" component={PublicContainer}/>
              </Switch>
            </Suspense>
          </BrowserRouter>
        </XsrfAuthUserProvider>
      </GlobalDialogProvider>
    </GlobalSnackbarProvider>
  );
}

