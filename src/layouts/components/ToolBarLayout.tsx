import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import React from "react";
import useStyles from "./LayoutStyle";
import {useHistory} from 'react-router';
import PropTypes from "prop-types";

function ToolBarLayout (props: any) {
  const classes = useStyles();
  const {title} = props;
  const history = useHistory();

  return (<React.Fragment>
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={()=>history.goBack()}>
          <Icon>arrow_back</Icon>
        </IconButton>
        <Typography variant="h6" noWrap>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
    <main className={classes.content}>
      <div className={classes.toolbar}/>
      {props.children}
    </main>
  </React.Fragment>)
}

ToolBarLayout.propType = {
  title: PropTypes.any.isRequired
}

export default ToolBarLayout
