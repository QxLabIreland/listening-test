import React, {Suspense} from 'react'; // {lazy,
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import {useTheme} from '@material-ui/core/styles';
import {Redirect, Route, Switch, useRouteMatch} from "react-router";
import Loading from "../shared/components/Loading";
import AudioAbList from "../views/AudioAb/AudioAbList";
import DashboardPage from "../views/DashboardPage";
import SettingsPage from "../views/SettingsPage";
import ListItemNavLink from "./components/ListItemNavLink";
import useStyles from "./components/LayoutStyle";
import AppBarLayout from "./components/AppBarLayout";
import ToolBarLayout from "./components/ToolBarLayout";
import {AudioAbView} from "../views/AudioAb/AudioAbView";
import MushraPage from "../views/MushraPage";

export default function AppBarDrawer(props: any) {
  let {path} = useRouteMatch();

  const {window} = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      <ListItemNavLink to={`${path}/dashboard`} icon='dashboard'>DASHBOARD</ListItemNavLink>
      <ListItemNavLink to={`${path}/audio-ab`} icon='headset'>Audio AB Test</ListItemNavLink>
      <ListItemNavLink to={`${path}/mushra`} icon='headset'>MUSHRA Test</ListItemNavLink>
      <ListItemNavLink to={`${path}/settings`} icon='settings'>Settings</ListItemNavLink>
      <Divider/>
      <ListItemNavLink to='/' icon='exit_to_app'>Sign out</ListItemNavLink>
    </List>
  );

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
          <AppBarLayout handleDrawerToggle={handleDrawerToggle}>
            <DashboardPage/>
          </AppBarLayout>
        </Route>
        <Route exact path={`${path}/audio-ab`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle}>
            <AudioAbList/>
          </AppBarLayout>
        </Route>
        <Route exact path={`${path}/mushra`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle}>
            <MushraPage/>
          </AppBarLayout>
        </Route>
        <Route exact path={`${path}/settings`}>
          <AppBarLayout handleDrawerToggle={handleDrawerToggle}>
            <SettingsPage/>
          </AppBarLayout>
        </Route>

        <Route path={`${path}/audio-ab/:id`}>
          <ToolBarLayout title='An Audio Test'><AudioAbView/></ToolBarLayout>
        </Route>

      </Switch>
    </Suspense>
  </div>;
}
