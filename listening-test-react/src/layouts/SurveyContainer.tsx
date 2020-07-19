import React, {Suspense} from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Loading from "./components/Loading";
import {Route, Switch, useRouteMatch} from 'react-router';
import {AbSurveyPage} from "../views/AbTest/AbSurvey/AbSurveyPage";
import {Redirect} from "react-router-dom";
import {isDevMode} from "../shared/ReactTools";
import SurveyFinishPage from "../views/PublicPages/SurveyFinishPage";
import {SurveyPage} from "../views/shared-views/SurveyPage";

export default function SurveyContainer() {
  const {path} = useRouteMatch();
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <Suspense fallback={<Loading/>}>
          <Switch>
            <Route exact path={`${path}/finish`} component={SurveyFinishPage}/>
            <Route exact path={`${path}/ab-test/:id`} component={AbSurveyPage}/>
            <Route exact path={`${path}/acr-test/:id`}><SurveyPage testUrl="acr-test"/></Route>
            <Route exact path={`${path}/mushra-test/:id`}><SurveyPage testUrl="mushra-test"/></Route>
            {!isDevMode() && <Redirect to="/not-found"/>}
          </Switch>
        </Suspense>
      </Container>
    </React.Fragment>
  )
}
