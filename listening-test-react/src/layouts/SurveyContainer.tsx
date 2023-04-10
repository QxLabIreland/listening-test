import React, { Suspense } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Redirect } from 'react-router-dom';

import { Box, Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import { CookiesPolicySnackbar } from '../views/PublicPages/PolicyTerms/CookiesPolicySnackbar';
import { StopReceivingResPage } from '../views/survery/StopRecivingResPage';
import SurveyFinishPage from '../views/survery/SurveyFinishPage';
import { SurveyPage } from '../views/survery/SurveyPage';
import Loading from './components/Loading';
import NotFoundView from './components/NotFoundView';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      backgroundColor: theme.palette.grey['800'],
    },
  })
);

const iOS = () => {
  return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
};

export default function SurveyContainer() {
  const { path } = useRouteMatch();
  const classes = useStyles();

  return (
    <React.Fragment>
      <AppBar position="sticky" color="primary" elevation={6}>
        <Toolbar className={classes.toolbar}>
          {/*<Button component={Link} to='/' color="inherit">Golisten.io</Button>*/}
          <Button color="inherit">Go Listen</Button>
          <span style={{ flexGrow: 1 }} />
          {/*<Typography>Subject View</Typography>*/}
        </Toolbar>
      </AppBar>
      <CssBaseline />
      {iOS() ? (
        <Container maxWidth="md">
          <Box marginTop={4}>
            <Alert severity="error">iOS devices are not supported, please use other operating systems.</Alert>
          </Box>
          <Box marginTop={2}>
            <Alert severity="info">
              We are sorry about the inconvenience. iOS platform has some restrictions on media playback in browser.
              Because of this, we can't provide a fully functional survey.
            </Alert>
          </Box>
        </Container>
      ) : (
        <Container maxWidth="md">
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route exact path={`${path}/finish`} component={SurveyFinishPage} />
              <Route exact path={`${path}/stop-receiving-res`} component={StopReceivingResPage} />
              <Route exact path={`${path}/ab-test/:id`}>
                <SurveyPage testUrl="ab-test" />
              </Route>
              <Route exact path={`${path}/acr-test/:id`}>
                <SurveyPage testUrl="acr-test" />
              </Route>
              <Route exact path={`${path}/mushra-test/:id`}>
                <SurveyPage testUrl="mushra-test" />
              </Route>
              <Route exact path={`${path}/hearing-test/:id`}>
                <SurveyPage testUrl="hearing-test" />
              </Route>
              <Route exact path={`${path}/audio-labeling/:id`}>
                <SurveyPage testUrl="audio-labeling" />
              </Route>
              <Route exact path={`${path}/image-labeling/:id`}>
                <SurveyPage testUrl="image-labeling" />
              </Route>
              <Route exact path={`${path}/image-ab/:id`}>
                <SurveyPage testUrl="image-ab" />
              </Route>
              <Route exact path={`${path}/video-labeling/:id`}>
                <SurveyPage testUrl="video-labeling" />
              </Route>
              <Route exact path={`${path}/video-ab/:id`}>
                <SurveyPage testUrl="video-ab" />
              </Route>
              {/*Not found page*/}
              <Route exact path={`${path}/not-found`}>
                <NotFoundView />
              </Route>
              <Redirect to={`${path}/not-found`} />
            </Switch>
          </Suspense>
          <CookiesPolicySnackbar />
        </Container>
      )}
    </React.Fragment>
  );
}
