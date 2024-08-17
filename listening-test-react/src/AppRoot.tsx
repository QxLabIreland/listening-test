import React from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { CssBaseline } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import AppContainer from './app/AppContainer';
import GlobalDialogProvider from './global/GlobalDialogProvider';
import GlobalSnackbarProvider from './global/GlobalSnackbarProvider';
import XsrfAuthUserProvider from './global/XsrfAuthUserProvider';
import PublicContainer from './public/PublicContainer';
import SurveyContainer from './survey/SurveyContainer';

const theme = createTheme({
  palette: {
    background: {
      default: grey[50],
    },
  },
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/user/*" element={<AppContainer />} />
      <Route path="/task/*" element={<SurveyContainer />} />
      <Route path="/*" element={<PublicContainer />} />
    </>,
  ),
);

export default function AppRoot() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalSnackbarProvider />
      <GlobalDialogProvider>
        <XsrfAuthUserProvider>
          <RouterProvider router={router} />
        </XsrfAuthUserProvider>
      </GlobalDialogProvider>
    </ThemeProvider>
  );
}
