import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import React, {useContext, useState} from "react";
import {Container} from "@material-ui/core";
import {Switch, useHistory} from "react-router";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {AppBarTitleContext} from "../../shared/ReactContexts";

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
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(2)
  }
}));

export default function AppBarLayout(props: any) {
  const {handleDrawerToggle} = props;
  const history = useHistory();
  const {title} = useContext(AppBarTitleContext);
  const classes = useStyles();

  return (
    <React.Fragment>
      <AppBar position="fixed" className={classes.appBar}>

        <Toolbar>
          {!title
            ? <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}
                          className={classes.menuButton}>
              <Icon>menu</Icon>
            </IconButton>
            : <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={() => history.goBack()}>
              <Icon>arrow_back</Icon>
            </IconButton>
          }
          <Typography variant="h6" noWrap>
            {title ? title : 'Listening Tests Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.toolbar}/>
        <Container maxWidth="md">
          {props.children}
        </Container>
      </main>
    </React.Fragment>
  )
}
