import React, {Suspense} from 'react' // , lazy}
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import {Button} from "@material-ui/core";
import {Link, Redirect, Route, Switch} from 'react-router-dom';
import Home from "../views/PublicPages/Home";
import SignIn from "../views/PublicPages/SignIn";
import SignUp from "../views/PublicPages/SingUp";
import Loading from "./components/Loading";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import FindPassword from "../views/PublicPages/FindPassword";
import ConfirmEmail from "../views/PublicPages/ConfirmEmail";
import NotFoundView from "./components/NotFoundView";

const useStyles = makeStyles((theme: Theme) => createStyles({
  toolbar: {
    backgroundColor: theme.palette.grey["800"]
  },
  button: {fontWeight: 700}
}));

export default function PublicContainer() {
  const classes = useStyles();
  return (
    <Suspense fallback={<Loading/>}>
      <AppBar position="sticky" color="primary" elevation={6}>
        <Toolbar className={classes.toolbar}>
          <Button component={Link} to='/' color="inherit" className={classes.button}>Go Listen</Button>
          {/*<Button component={Link} to='about'>About</Button>*/}
          <span style={{flexGrow: 1}}/>
          <Button component={Link} to='sign-in' color="inherit" variant="outlined" className={classes.button}>Login</Button>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/sign-in" component={SignIn}/>
        <Route exact path="/sign-up" component={SignUp}/>
        <Route exact path="/find-password" component={FindPassword}/>
        <Route exact path="/confirm-email" component={ConfirmEmail}/>
        {/*Not found page*/}
        <Route exact path="/not-found"><NotFoundView/></Route>
        <Redirect to="/not-found"/>
      </Switch>
    </Suspense>
  );
}
