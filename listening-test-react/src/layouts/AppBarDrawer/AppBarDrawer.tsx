import React, {Suspense} from 'react'; // {lazy,
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import {createStyles, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import {Redirect, Route, Switch, useHistory, useRouteMatch} from "react-router";
import Loading from "../../shared/components/Loading";
import DashboardPage from "../../views/DashboardPage";
import SettingsPage from "../../views/SettingsPage";
import ListItemNavLink from "./ListItemNavLink";
import AppBarLayout, {drawerWidth} from "./AppBarLayout";
import {AudioAbDetail} from "../../views/AbTest/AudioAbDetail";
import MushraPage from "../../views/MushraPage";
import TestResponsePage from "../../views/TestResponses/TestResponsePage";
import AbTestPage from "../../views/AbTest/AbTestPage";
import Axios from "axios";

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
    <ListItemNavLink to={`${path}/responses`} icon='assignment'>Test Responses</ListItemNavLink>
    <Divider/>
    <ListItemNavLink to={`${path}/ab-test`} icon='headset'>AB Test</ListItemNavLink>
    <ListItemNavLink to={`${path}/mushra`} icon='linear_scale'>MUSHRA Test</ListItemNavLink>
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
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixed><DashboardPage/></AppBarLayout>
        </Route>
        <Route path={`${path}/responses`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixed><TestResponsePage/></AppBarLayout>
        </Route>
        <Route exact path={`${path}/ab-test`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixed><AbTestPage/></AppBarLayout>
        </Route>
        <Route exact path={`${path}/mushra`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixed><MushraPage/></AppBarLayout>
        </Route>
        <Route exact path={`${path}/settings`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} fixed><SettingsPage/></AppBarLayout>
        </Route>
        {/*Detail with back arrow button. Aka: no navigation page*/}
        <Route exact path={`${path}/ab-test/:id`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle}><AudioAbDetail/></AppBarLayout>
        </Route>
        {/*Context make this not working*/}
        <Redirect to="/not-found"/>
      </Switch>
    </Suspense>
  </div>;
}
