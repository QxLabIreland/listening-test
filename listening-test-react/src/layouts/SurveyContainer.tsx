import React, { Suspense } from 'react';
import 'react-router';
import { Route, Routes } from 'react-router-dom';

import { Alert, Box, Button, Theme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { createStyles, makeStyles } from '@mui/styles';

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
            <Routes>
              <Route path="finish" element={<SurveyFinishPage />} />
              <Route path="stop-receiving-res" element={<StopReceivingResPage />} />
              <Route path="ab-test/:id" element={<SurveyPage testUrl="ab-test" />} />
              <Route path="acr-test/:id" element={<SurveyPage testUrl="acr-test" />} />
              <Route path="mushra-test/:id" element={<SurveyPage testUrl="mushra-test" />} />
              <Route path="hearing-test/:id" element={<SurveyPage testUrl="hearing-test" />} />
              <Route path="audio-labeling/:id" element={<SurveyPage testUrl="audio-labeling" />} />
              <Route path="image-labeling/:id" element={<SurveyPage testUrl="image-labeling" />} />
              <Route path="image-ab/:id" element={<SurveyPage testUrl="image-ab" />} />
              <Route path="video-labeling/:id" element={<SurveyPage testUrl="video-labeling" />} />
              <Route path="video-ab/:id" element={<SurveyPage testUrl="video-ab" />} />
              {/*Not found page*/}
              <Route element={<NotFoundView />} />
            </Routes>
          </Suspense>
          <CookiesPolicySnackbar />
        </Container>
      )}
    </React.Fragment>
  );
}
