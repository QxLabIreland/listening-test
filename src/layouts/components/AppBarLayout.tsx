import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import React from "react";
import useStyles from "./LayoutStyle";
import {Container} from "@material-ui/core";
import {useHistory} from "react-router";

export default function AppBarLayout(props: any) {
  const {handleDrawerToggle} = props;
  const {title} = props;
  const history = useHistory();

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
            {title ? title : 'Listening Test'}
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

