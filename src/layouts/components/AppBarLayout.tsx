import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import React from "react";
import useStyles from "./LayoutStyle";

export default function AppBarLayout (props: any) {
  const {handleDrawerToggle} = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}
                      className={classes.menuButton}>
            <Icon>menu</Icon>
          </IconButton>
          <Typography variant="h6" noWrap>
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.toolbar}/>
        {props.children}
      </main>
    </React.Fragment>
  )
}

