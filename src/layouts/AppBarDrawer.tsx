import React, {Suspense} from 'react'; // {lazy,
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import {createStyles, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import {Redirect, Route, Switch, useRouteMatch} from "react-router";
import Loading from "../shared/components/Loading";
import AudioAbList from "../views/AudioAb/AudioAbList";
import DashboardPage from "../views/DashboardPage";
import SettingsPage from "../views/SettingsPage";
import ListItemNavLink from "./components/ListItemNavLink";
import AppBarLayout, {drawerWidth} from "./components/AppBarLayout";
import {AudioAbDetail} from "../views/AudioAb/AudioAbDetail";
import MushraPage from "../views/MushraPage";
import TestResponsePage from "../views/TestResponses/TestResponsePage";
import AbTestPage from "../views/AudioAb/AbTestPage";

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

  const drawer = <List>
    <ListItemNavLink to={`${path}/dashboard`} icon='dashboard'>DASHBOARD</ListItemNavLink>
    <ListItemNavLink to={`${path}/responses`} icon='assignment'>Test Responses</ListItemNavLink>
    <Divider/>
    <ListItemNavLink to={`${path}/ab-test`} icon='headset'>AB Test</ListItemNavLink>
    <ListItemNavLink to={`${path}/mushra`} icon='linear_scale'>MUSHRA Test</ListItemNavLink>
    <Divider/>
    <ListItemNavLink to={`${path}/settings`} icon='settings'>Settings</ListItemNavLink>
    <ListItemNavLink to='/' icon='exit_to_app'>Sign out</ListItemNavLink>
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
          <AppBarLayout handleDrawerToggle={handleDrawerToggle}><DashboardPage/></AppBarLayout>
        </Route>
        <Route path={`${path}/responses`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle}><TestResponsePage/></AppBarLayout>
        </Route>
        <Route exact path={`${path}/ab-test`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle}><AbTestPage/></AppBarLayout>
        </Route>
        <Route exact path={`${path}/mushra`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle}><MushraPage/></AppBarLayout>
        </Route>
        <Route exact path={`${path}/settings`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle}><SettingsPage/></AppBarLayout>
        </Route>

        <Route exact path={`${path}/ab-test/:id`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle} title='An AB Test'>
            <AudioAbDetail/>
          </AppBarLayout>
        </Route>

      </Switch>
    </Suspense>
  </div>;
}