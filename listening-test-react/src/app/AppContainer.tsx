import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Box, ListSubheader } from '@mui/material';
// {lazy,
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';

import NotFoundView from '../shared/components/NotFoundView';
import { AppPermissions } from '../shared/enums/permissions';
import { TEST_URLS, URL_TO_TITLE } from '../shared/enums/test-urls';
import AppBarLayout, { DRAWER_WIDTH } from './AppBarDrawer/AppBarLayout';
import AuthRoute from './AppBarDrawer/AuthRoute';
import { useUserAuthResult } from './AppBarDrawer/AuthRoute';
import { ListItemNavLink } from './AppBarDrawer/ListItemNavLink';
import DashboardPage from './general/DashboardPage';
import ManageStorage from './general/ManageStorage';
import SettingsPage from './general/SettingsPage';
import TemplatesPage from './general/TemplatesPage';
import TestTabPage from './test-details/TestTabPage';
import TestListPage from './test-list/TestListPage';
import { ManageUsers } from './users/ManageUsers';

const DrawerList = () => {
  const videoPermission = useUserAuthResult(AppPermissions.Veido);

  return (
    <List>
      <ListItemNavLink to="dashboard" icon="dashboard">
        Go Listen Home
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

export default function AppContainer() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <AuthRoute>
      <Box display="flex">
        <Box component="nav" sx={{ width: { md: DRAWER_WIDTH } }}>
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            // container={window.document.body}
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
            }}>
            <DrawerList />
          </Drawer>
          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
            }}>
            <DrawerList />
          </Drawer>
        </Box>

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
            {TEST_URLS.map(url => (
              <Route
                key={url}
                path={`${url}/:id`}
                element={<TestTabPage testName={URL_TO_TITLE[url]} testUrl={url} />}
              />
            ))}

            {/*Context make this not working*/}
            <Route element={<NotFoundView />} />
          </Routes>
        </AppBarLayout>
      </Box>
    </AuthRoute>
  );
}
