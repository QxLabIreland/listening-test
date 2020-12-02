import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import React, {PropsWithChildren, useState} from "react";
import {Container} from "@material-ui/core";
import {useHistory} from "react-router";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {AppBarTitle} from "../../shared/ReactContexts";
import {NotificationDrawer} from "./NotificationDrawer";
import {AccountDropMenu} from "./AccountDropMenu";

export const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) => createStyles({
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: {...theme.mixins.toolbar},
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2)
  },
  grow: {flexGrow: 1},
  toolBar: {display: 'flex'}
}));

export default function AppBarLayout(props: PropsWithChildren<{ handleDrawerToggle: any, fixedTitle?: boolean}>) {
  const {handleDrawerToggle, fixedTitle} = props;
  const history = useHistory();
  const [title, setTitle] = useState<string>();
  const classes = useStyles();

  return (
    <AppBarTitle.Provider value={{title: title, setTitle: title => setTitle(title)}}>

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          {fixedTitle
            ? <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}
                          className={classes.menuButton}>
              <Icon>menu</Icon>
            </IconButton>
            : <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={() => history.goBack()}>
              <Icon>arrow_back</Icon>
            </IconButton>
          }
          <Typography variant="h6" noWrap>
            {fixedTitle ? 'Go Listen Dashboard' : title}
          </Typography>
          <div className={classes.grow}/>
          <AccountDropMenu/>
          <NotificationDrawer/>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.toolbar}/>
        <Container maxWidth="md">
          {props.children}
        </Container>
      </main>

    </AppBarTitle.Provider>
  )
}
