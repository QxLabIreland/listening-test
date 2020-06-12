import React, {Suspense} from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Loading from "../shared/components/Loading";
import {Route, Switch, useRouteMatch} from 'react-router';
import {AbSurveyPage} from "../views/AbTask/AbSurveyPage";

export default function SurveyContainer() {
  const {path} = useRouteMatch();
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <Suspense fallback={<Loading/>}>
          <Switch>
            <Route exact path={`${path}/ab-test/:id`} component={AbSurveyPage}/>
          </Switch>
        </Suspense>
      </Container>
    </React.Fragment>
  )
}
