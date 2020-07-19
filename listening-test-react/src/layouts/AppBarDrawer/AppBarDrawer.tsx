import React, {Suspense} from 'react'; // {lazy,
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import {createStyles, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import {Redirect, Route, Switch, useRouteMatch} from "react-router";
import Loading from "../components/Loading";
import DashboardPage from "../../views/DashboardPage";
import SettingsPage from "../../views/SettingsPage";
import ListItemNavLink from "./ListItemNavLink";
import AppBarLayout, {drawerWidth} from "./AppBarLayout";
import Axios from "axios";
import AbTestTab from "../../views/AbTest/AbTestTab";
import TestListView from "../../views/shared-views/TestListView";
import {isDevMode} from "../../shared/ReactTools";
import TestTabPage from "../../views/shared-views/TestTabPage";

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  }
}));

export default function AppBarDrawer(props: any) {
  const {path} = useRouteMatch();
  const {window} = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSignOut = () => Axios.delete('/api/login').then()

  const drawer = <List>
    <ListItemNavLink to={`${path}/dashboard`} icon='dashboard'>DASHBOARD</ListItemNavLink>
    <Divider/>
    <ListItemNavLink to={`${path}/ab-test`} icon='headset'>AB Test</ListItemNavLink>
    <ListItemNavLink to={`${path}/acr-test`} icon='music_note'>ACR Test</ListItemNavLink>
    <ListItemNavLink to={`${path}/mushra-test`} icon='linear_scale'>MUSHRA Test</ListItemNavLink>
    <ListItemNavLink to={`${path}/hearing-test`} icon='hearing'>Hearing Test</ListItemNavLink>
    <Divider/>
    <ListItemNavLink to={`${path}/settings`} icon='settings'>Settings</ListItemNavLink>
    <ListItemNavLink to="/sign-in" icon='exit_to_app' onClick={handleSignOut}>Sign out</ListItemNavLink>
  </List>

  const container = window !== undefined ? () => window().document.body : undefined;

  return <div className={classes.root}>
    <CssBaseline/>
    <nav className={classes.drawer} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <Drawer container={container} variant="temporary" anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={mobileOpen} onClose={handleDrawerToggle} classes={{paper: classes.drawerPaper}}
                ModalProps={{keepMounted: true}}>
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer classes={{paper: classes.drawerPaper,}} variant="permanent" open>{drawer}</Drawer>
      </Hidden>
    </nav>
    <Suspense fallback={<Loading/>}>
      <Switch>
        <Redirect exact from={`${path}`} to={`${path}/dashboard`}/>
        {/*Navigation page*/}
        <Route exact path={`${path}/dashboard`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle><DashboardPage/></AppBarLayout>
        </Route>
        <Route exact path={`${path}/ab-test`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle><TestListView testUrl="ab-test"/></AppBarLayout>
        </Route>
        <Route exact path={`${path}/acr-test`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle><TestListView testUrl="acr-test"/></AppBarLayout>
        </Route>
        <Route exact path={`${path}/mushra-test`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle><TestListView testUrl="mushra-test"/></AppBarLayout>
        </Route>
        <Route exact path={`${path}/hearing-test`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle><TestListView testUrl="hearing-test"/></AppBarLayout>
        </Route>
        <Route exact path={`${path}/settings`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixedTitle><SettingsPage/></AppBarLayout>
        </Route>
        {/*Detail with back arrow button. Aka: no navigation page*/}
        <Route exact path={`${path}/ab-test/:id`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle}><AbTestTab/></AppBarLayout>
        </Route>
        <Route exact path={`${path}/acr-test/:id`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle}>
            <TestTabPage testName="ACR Test" testType="acrTest"/>
          </AppBarLayout>
        </Route>
        <Route exact path={`${path}/mushra-test/:id`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle}>
            <TestTabPage testName="MUSHRA Test" testType="mushraTest"/>
          </AppBarLayout>
        </Route>
        {/*Context make this not working*/}
        {!isDevMode() && <Redirect to="/not-found"/>}
      </Switch>
    </Suspense>
  </div>;
}
