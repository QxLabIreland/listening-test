import AuthRoute from './AppBarDrawer/AuthRoute';
import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { ListSubheader, Theme } from '@mui/material';
// {lazy,
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Hidden from '@mui/material/Hidden';
import List from '@mui/material/List';
import { createStyles, makeStyles } from '@mui/styles';

import { TEST_URLS, TestUrl } from '../shared/enums/test-urls';
import DashboardPage from './general/DashboardPage';
import ManageStorage from './general/ManageStorage';
import SettingsPage from './general/SettingsPage';
import TemplatesPage from './general/TemplatesPage';
import TestListPage from './test-list/TestListPage';
import TestTabPage from './test-list/TestTabPage';
import { ManageUsers } from './users/ManageUsers';
import { useUserAuthResult } from './AppBarDrawer/AuthRoute';
import NotFoundView from '../layouts/components/NotFoundView';
import { ListItemNavLink } from './AppBarDrawer/ListItemNavLink';
import AppBarLayout from './AppBarDrawer/AppBarLayout';
import { AppPermissions } from '../shared/enums/permissions';

const DrawerList = () => {
  const videoPermission = useUserAuthResult(AppPermissions.Veido);

  return (
    <List>
      <ListItemNavLink to="dashboard" icon="dashboard">
        DASHBOARD
      </ListItemNavLink>
      <ListItemNavLink to="storage" icon="storage" permission={AppPermissions.Storage}>
        Storage Status
      </ListItemNavLink>
      <ListItemNavLink to="people" icon="account_box" permission={AppPermissions.User}>
        Manage Users
      </ListItemNavLink>
      <ListItemNavLink to="template" icon="note_add" permission={AppPermissions.Template}>
        Manage Templates
      </ListItemNavLink>
      <Divider />
      <ListSubheader style={{ background: 'white' }}>Audio Tasks</ListSubheader>
      <ListItemNavLink to="ab-test" icon="headset">
        Audio AB
      </ListItemNavLink>
      <ListItemNavLink to="acr-test" icon="music_note">
        Audio ACR
      </ListItemNavLink>
      <ListItemNavLink to="mushra-test" icon="linear_scale">
        Audio MUSHRA
      </ListItemNavLink>
      <ListItemNavLink to="audio-labeling" icon="label_important">
        Audio Labelling
      </ListItemNavLink>
      <ListItemNavLink to="hearing-test" icon="hearing">
        Hearing Test (Beta)
      </ListItemNavLink>
      <Divider />
      <ListSubheader>Image Tasks</ListSubheader>
      <ListItemNavLink to="image-labeling" icon="image_search">
        Image Labelling
      </ListItemNavLink>
      <ListItemNavLink to="image-ab" icon="brightness_6">
        Image AB
      </ListItemNavLink>
      {/*<ListItemNavLink to={`${path}/image-acr`} icon='wallpaper'>Image ACR</ListItemNavLink>*/}
      {videoPermission && (
        <>
          <Divider />
          <ListSubheader>Video Tasks</ListSubheader>
          <ListItemNavLink to="video-labeling" icon="movie">
            Video Labelling
          </ListItemNavLink>
          <ListItemNavLink to="video-ab" icon="video_library">
            Video AB
          </ListItemNavLink>
        </>
      )}
      {/*<ListItemNavLink to={`${path}/video-acr`} icon='ondemand_video'>Video ACR</ListItemNavLink>*/}
    </List>
  );
};

const testUrlsWithTitle = [
  ['ab-test', 'AB Test'],
  ['acr-test', 'ACR Test'],
  ['mushra-test', 'MUSHRA Test'],
  ['hearing-test', 'Hearing Sensitivity Test'],
  ['audio-labeling', 'Audio Labeling Task'],
  ['image-labeling', 'Image Labeling Task'],
  ['image-ab', 'Image AB Task'],
  ['video-labeling', 'Video Labeling Task'],
  ['video-ab', 'Video AB Task'],
] as [TestUrl, string][];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { display: 'flex' },
    drawer: { [theme.breakpoints.up('sm')]: { width: 240, flexShrink: 0 } },
    drawerPaper: { width: 240 },
  }),
);

export default function AppContainer() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <AuthRoute>
      <div className={classes.root}>
        <CssBaseline />
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              // container={window.document.body}
              variant="temporary"
              anchor="left"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{ paper: classes.drawerPaper }}
              ModalProps={{ keepMounted: true }}>
              <DrawerList />
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer classes={{ paper: classes.drawerPaper }} variant="permanent" open>
              <DrawerList />
            </Drawer>
          </Hidden>
        </nav>

        <AppBarLayout handleDrawerToggle={handleDrawerToggle}>
          <Routes>
            <Route path="" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route
              path="storage"
              element={
                <AuthRoute permission={AppPermissions.Storage}>
                  <ManageStorage />
                </AuthRoute>
              }
            />
            <Route
              path="people"
              element={
                <AuthRoute permission={AppPermissions.User}>
                  <ManageUsers />
                </AuthRoute>
              }
            />
            <Route
              path="template"
              element={
                <AuthRoute permission={AppPermissions.Template}>
                  <TemplatesPage />
                </AuthRoute>
              }
            />
            <Route path="settings" element={<SettingsPage />} />
            {/*Listening Task routes*/}
            {TEST_URLS.map((testUrl, i) => (
              <Route key={i} path={testUrl} element={<TestListPage testUrl={testUrl} />} />
            ))}
            {/*Detail with back arrow button. Aka: no navigation page*/}
            {testUrlsWithTitle.map((urlTitle, i) => (
              <Route
                key={i}
                path={`${urlTitle[0]}/:id`}
                element={<TestTabPage testName={urlTitle[1]} testUrl={urlTitle[0]} />}
              />
            ))}

            {/*Context make this not working*/}
            <Route element={<NotFoundView />} />
          </Routes>
        </AppBarLayout>
      </div>
    </AuthRoute>
  );
}
