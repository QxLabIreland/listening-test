import React, {Suspense} from 'react'; // {lazy,
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {Redirect, Route, Switch, useRouteMatch} from "react-router";
import Loading from "../components/Loading";
import DashboardPage from "../../views/DashboardPage";
import SettingsPage from "../../views/SettingsPage";
import {ListItemNavLink} from "./ListItemNavLink";
import AppBarLayout, {drawerWidth} from "./AppBarLayout";
import Axios from "axios";
import TestListPage from "../../views/shared-views/TestListPage";
import TestTabPage from "../../views/shared-views/TestTabPage";
import ManageUsers from "../../views/ManageUsers";
import AuthRoute from "../components/AuthRoute";
import TemplatesPage from "../../views/TemplatesPage";
import ManageStorage from "../../views/ManageStorage";
import {ListSubheader} from "@material-ui/core";
import NotFoundView from "../components/NotFoundView";
import {TestUrl} from "../../shared/models/EnumsAndTypes";

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {display: 'flex'},
  drawer: {[theme.breakpoints.up('sm')]: {width: drawerWidth, flexShrink: 0}},
  drawerPaper: {width: drawerWidth}
}));

export function AppBarDrawer(props: any) {
  const {path} = useRouteMatch();
  const {window} = props;
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleSignOut = () => Axios.delete('/api/login').then();
  const DrawerList = () => <List>
    <ListItemNavLink to={`${path}/dashboard`} icon='dashboard'>DASHBOARD</ListItemNavLink>
    <ListItemNavLink to={`${path}/storage`} icon='storage' permission="Storage">Storage Status</ListItemNavLink>
    <ListItemNavLink to={`${path}/people`} icon='account_box' permission="User">Manage Users</ListItemNavLink>
    <ListItemNavLink to={`${path}/template`} icon='note_add' permission="Template">Manage Templates</ListItemNavLink>
    <Divider/>
    <ListSubheader style={{background: 'white'}}>Audio Tasks</ListSubheader>
    <ListItemNavLink to={`${path}/ab-test`} icon='headset'>Audio AB</ListItemNavLink>
    <ListItemNavLink to={`${path}/acr-test`} icon='music_note'>Audio ACR</ListItemNavLink>
    <ListItemNavLink to={`${path}/mushra-test`} icon='linear_scale'>Audio MUSHRA</ListItemNavLink>
    <ListItemNavLink to={`${path}/audio-labeling`} icon='label_important'>Audio Labelling</ListItemNavLink>
    <ListItemNavLink to={`${path}/hearing-test`} icon='hearing'>Hearing Test (Beta)</ListItemNavLink>
    <Divider/>
    <ListSubheader>Image Tasks</ListSubheader>
    <ListItemNavLink to={`${path}/image-labeling`} icon='image_search'>Image Labelling</ListItemNavLink>
    <ListItemNavLink to={`${path}/image-ab`} icon='brightness_6'>Image AB</ListItemNavLink>
    {/*<ListItemNavLink to={`${path}/image-acr`} icon='wallpaper'>Image ACR</ListItemNavLink>*/}
    <Divider/>
    <ListSubheader>Video Tasks</ListSubheader>
    <ListItemNavLink to={`${path}/video-labeling`} icon='movie'>Video Labelling</ListItemNavLink>
    <ListItemNavLink to={`${path}/video-ab`} icon='video_library'>Video AB</ListItemNavLink>
    {/*<ListItemNavLink to={`${path}/video-acr`} icon='ondemand_video'>Video ACR</ListItemNavLink>*/}
    <Divider/>
    <ListSubheader>Others</ListSubheader>
    <ListItemNavLink to={`${path}/settings`} icon='settings'>Settings</ListItemNavLink>
    <ListItemNavLink to="/sign-in" icon='exit_to_app' onClick={handleSignOut}>Sign out</ListItemNavLink>
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
      <Switch>
        <Redirect exact from={`${path}`} to={`${path}/dashboard`}/>
        {/*Navigation page*/}
        <Route exact path={`${path}/dashboard`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle><DashboardPage/></AppBarLayout>
        </Route>
        <AuthRoute exact path={`${path}/storage`} permission="Storage">
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle>
            <ManageStorage/>
          </AppBarLayout>
        </AuthRoute>
        <AuthRoute exact path={`${path}/people`} permission="User">
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle>
            <ManageUsers/>
          </AppBarLayout>
        </AuthRoute>
        <AuthRoute exact path={`${path}/template`} permission="Template">
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle>
            <TemplatesPage/>
          </AppBarLayout>
        </AuthRoute>
        <Route exact path={`${path}/settings`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle><SettingsPage/></AppBarLayout>
        </Route>

        {/*Listening Task routes*/}
        {testUrls.map((testUrl, i) => <Route key={i} exact path={`${path}/${testUrl}`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle>
            <TestListPage testUrl={testUrl}/>
          </AppBarLayout>
        </Route>)}
        {/*Detail with back arrow button. Aka: no navigation page*/}
        {testUrlsWithTitle.map((urlTitle, i) => <Route key={i} exact path={`${path}/${urlTitle[0]}/:id`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle}>
            <TestTabPage testName={urlTitle[1]} testUrl={urlTitle[0]}/>
          </AppBarLayout>
        </Route>)}

        {/*Context make this not working*/}
        <Route exact path={`${path}/not-found`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle><NotFoundView/></AppBarLayout>
        </Route>
        <Redirect to={`${path}/not-found`}/>
      </Switch>
    </Suspense>
  </div>;
}
