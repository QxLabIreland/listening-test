import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ListSubheader, Theme } from '@mui/material';
// {lazy,
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Hidden from '@mui/material/Hidden';
import List from '@mui/material/List';
import { createStyles, makeStyles } from '@mui/styles';

import { TestUrl } from '../../shared/models/EnumsAndTypes';
import DashboardPage from '../../views/DashboardPage';
import ManageStorage from '../../views/ManageStorage';
import SettingsPage from '../../views/SettingsPage';
import TemplatesPage from '../../views/TemplatesPage';
import TestListPage from '../../views/test-list/TestListPage';
import TestTabPage from '../../views/test-list/TestTabPage';
import { ManageUsers } from '../../views/users/ManageUsers';
import AuthRoute, { useUserAuthResult } from '../components/AuthRoute';
import Loading from '../components/Loading';
import NotFoundView from '../components/NotFoundView';
import AppBarLayout, { drawerWidth } from './AppBarLayout';
import { ListItemNavLink } from './ListItemNavLink';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {display: 'flex'},
  drawer: {[theme.breakpoints.up('sm')]: {width: drawerWidth, flexShrink: 0}},
  drawerPaper: {width: drawerWidth}
}));

export function AppBarDrawer(props: any) {
  const {window} = props;
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const videoPermission = useUserAuthResult('Video');

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const DrawerList = () => <List>
    <ListItemNavLink to="dashboard" icon='dashboard'>DASHBOARD</ListItemNavLink>
    <ListItemNavLink to="storage" icon='storage' permission="Storage">Storage Status</ListItemNavLink>
    <ListItemNavLink to="people" icon='account_box' permission="User">Manage Users</ListItemNavLink>
    <ListItemNavLink to="template" icon='note_add' permission="Template">Manage Templates</ListItemNavLink>
    <Divider/>
    <ListSubheader style={{background: 'white'}}>Audio Tasks</ListSubheader>
    <ListItemNavLink to="ab-test" icon='headset'>Audio AB</ListItemNavLink>
    <ListItemNavLink to="acr-test" icon='music_note'>Audio ACR</ListItemNavLink>
    <ListItemNavLink to="mushra-test" icon='linear_scale'>Audio MUSHRA</ListItemNavLink>
    <ListItemNavLink to="audio-labeling" icon='label_important'>Audio Labelling</ListItemNavLink>
    <ListItemNavLink to="hearing-test" icon='hearing'>Hearing Test (Beta)</ListItemNavLink>
    <Divider/>
      <ListSubheader>Image Tasks</ListSubheader>
    <ListItemNavLink to="image-labeling" icon='image_search'>Image Labelling</ListItemNavLink>
    <ListItemNavLink to="image-ab" icon='brightness_6'>Image AB</ListItemNavLink>
    {/*<ListItemNavLink to={`${path}/image-acr`} icon='wallpaper'>Image ACR</ListItemNavLink>*/}
    {videoPermission && <>
      <Divider/>
          <ListSubheader>Video Tasks</ListSubheader>
      <ListItemNavLink to="video-labeling" icon='movie'>Video Labelling</ListItemNavLink>
      <ListItemNavLink to="video-ab" icon='video_library'>Video AB</ListItemNavLink>
    </>}
    {/*<ListItemNavLink to={`${path}/video-acr`} icon='ondemand_video'>Video ACR</ListItemNavLink>*/}
    </List>

  const container = window !== undefined ? () => window().document.body : undefined;
  const testUrls = ['ab-test', 'acr-test', 'mushra-test', 'hearing-test', 'audio-labeling', 'image-labeling', 'image-ab', 'video-labeling', 'video-ab'] as TestUrl[];
  const testUrlsWithTitle = [
    ['ab-test', 'AB Test'], ['acr-test', 'ACR Test'], ['mushra-test', 'MUSHRA Test'],
    ['hearing-test', 'Hearing Sensitivity Test'], ['audio-labeling', 'Audio Labeling Task'],
    ['image-labeling', 'Image Labeling Task'], ['image-ab', 'Image AB Task'], ['video-labeling', 'Video Labeling Task'],
    ['video-ab', 'Video AB Task']
  ] as [TestUrl, string][];

  return <div className={classes.root}>
    <CssBaseline/>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
        <Drawer container={container} variant="temporary" anchor="left"
                open={mobileOpen} onClose={handleDrawerToggle} classes={{paper: classes.drawerPaper}}
                ModalProps={{keepMounted: true}}>
          <DrawerList/>
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
        <Drawer classes={{paper: classes.drawerPaper,}} variant="permanent" open><DrawerList/></Drawer>
        </Hidden>
      </nav>
      <Suspense fallback={<Loading/>}>
        <Routes>
          <Route path="" element={<Navigate to="dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle>
                <DashboardPage />
              </AppBarLayout>
            }
          />
          <Route
            path="storage"
            element={
              <AuthRoute permission="Storage">
                <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle>
                  <ManageStorage />
                </AppBarLayout>
              </AuthRoute>
            }
          />
          <Route
            path="people"
            element={
              <AuthRoute permission="User">
                <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle>
                  <ManageUsers />
                </AppBarLayout>
              </AuthRoute>
            }
          />
          <Route
            path="template"
            element={
              <AuthRoute permission="Template">
                <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle>
                  <TemplatesPage />
                </AppBarLayout>
              </AuthRoute>
            }
          />
          <Route
            path="settings"
            element={
              <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle>
                <SettingsPage />
              </AppBarLayout>
            }
          />
          {/*Listening Task routes*/}
          {testUrls.map((testUrl, i) => (
            <Route
              key={i}
              path={testUrl}
              element={
                <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle>
                  <TestListPage testUrl={testUrl} />
                </AppBarLayout>
              }
            />
          ))}
          {/*Detail with back arrow button. Aka: no navigation page*/}
          {testUrlsWithTitle.map((urlTitle, i) => (
            <Route
              key={i}
              path={`${urlTitle[0]}/:id`}
              element={
                <AppBarLayout handleDrawerToggle={handleDrawerToggle}>
                  <TestTabPage testName={urlTitle[1]} testUrl={urlTitle[0]} />
                </AppBarLayout>
              }
            />
          ))}

          {/*Context make this not working*/}
          <Route
            element={
              <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle>
                <NotFoundView />
              </AppBarLayout>
            }
          />
        </Routes>
      </Suspense>
    </div>
}
