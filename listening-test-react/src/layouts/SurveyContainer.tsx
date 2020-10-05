import React, {Suspense} from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Loading from "./components/Loading";
import {Route, Switch, useRouteMatch} from 'react-router';
import {Redirect} from "react-router-dom";
import {isDevMode} from "../shared/ReactTools";
import SurveyFinishPage from "../views/PublicPages/SurveyFinishPage";
import {SurveyPage} from "../views/shared-views/SurveyPage";
import Toolbar from "@material-ui/core/Toolbar";
import {Button} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import NotFoundView from "./components/NotFoundView";

const useStyles = makeStyles((theme: Theme) => createStyles({
  toolbar: {
    backgroundColor: theme.palette.grey["800"]
  }
}));

export default function SurveyContainer() {
  const {path} = useRouteMatch();
  const classes = useStyles();
  return (
    <React.Fragment>
      <AppBar position="sticky" color="primary" elevation={6}>
        <Toolbar className={classes.toolbar}>
          {/*<Button component={Link} to='/' color="inherit">Golisten.io</Button>*/}
          <Button color="inherit">Go Listen</Button>
          <span style={{flexGrow: 1}}/>
          {/*<Typography>Subject View</Typography>*/}
        </Toolbar>
      </AppBar>
      <CssBaseline />
      <Container maxWidth="md">
        <Suspense fallback={<Loading/>}>
          <Switch>
            <Route exact path={`${path}/finish`} component={SurveyFinishPage}/>
            <Route exact path={`${path}/ab-test/:id`}><SurveyPage testUrl="ab-test"/></Route>
            <Route exact path={`${path}/acr-test/:id`}><SurveyPage testUrl="acr-test"/></Route>
            <Route exact path={`${path}/mushra-test/:id`}><SurveyPage testUrl="mushra-test"/></Route>
            <Route exact path={`${path}/hearing-test/:id`}><SurveyPage testUrl="hearing-test"/></Route>
            <Route exact path={`${path}/audio-labeling/:id`}><SurveyPage testUrl="audio-labeling"/></Route>
            <Route exact path={`${path}/image-labeling/:id`}><SurveyPage testUrl="image-labeling"/></Route>
            <Route exact path={`${path}/video-labeling/:id`}><SurveyPage testUrl="video-labeling"/></Route>
            {/*Not found page*/}
            <Route exact path={`${path}/not-found`}><NotFoundView/></Route>
            <Redirect to={`${path}/not-found`}/>
          </Switch>
        </Suspense>
      </Container>
    </React.Fragment>
  )
}
