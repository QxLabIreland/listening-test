import React from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/styles';

import AppContainer from './app/AppContainer';
import PublicContainer from './public/PublicContainer';
import GlobalDialogProvider from './shared/providers/GlobalDialogProvider';
import GlobalSnackbarProvider from './shared/providers/GlobalSnackbarProvider';
import XsrfAuthUserProvider from './shared/providers/XsrfAuthUserProvider';
import SurveyContainer from './survey/SurveyContainer';

const theme = createTheme();

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
      <GlobalSnackbarProvider>
        <GlobalDialogProvider>
          <XsrfAuthUserProvider>
            <RouterProvider router={router} />
          </XsrfAuthUserProvider>
        </GlobalDialogProvider>
      </GlobalSnackbarProvider>
    </ThemeProvider>
  );
}
