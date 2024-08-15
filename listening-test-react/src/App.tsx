import React from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/styles';

import { AppBarDrawer } from './layouts/AppBarDrawer/AppBarDrawer';
import PublicContainer from './layouts/PublicContainer';
import SurveyContainer from './layouts/SurveyContainer';
import AuthRoute from './layouts/components/AuthRoute';
import GlobalDialogProvider from './shared/providers/GlobalDialogProvider';
import GlobalSnackbarProvider from './shared/providers/GlobalSnackbarProvider';
import XsrfAuthUserProvider from './shared/providers/XsrfAuthUserProvider';

const theme = createTheme();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/task/*" element={<SurveyContainer />} />
      <Route
        path="/user/*"
        element={
          <AuthRoute>
            <AppBarDrawer />
          </AuthRoute>
        }
      />
      <Route path="/*" element={<PublicContainer />} />
    </>
  )
);

export default function App() {
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
