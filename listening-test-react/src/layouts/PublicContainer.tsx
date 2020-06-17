import React, {Suspense} from 'react' // , lazy}
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import {Button} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {Link, Redirect, Route, Switch} from 'react-router-dom';

import Home from "../views/PublicPages/Home";
import SignIn from "../views/PublicPages/SignIn";
import SignUp from "../views/PublicPages/SingUp";
import Loading from "../shared/components/Loading";

export default function PublicContainer() {
  return (
    <Suspense fallback={<Loading/>}>
      <AppBar position="sticky" color="default" elevation={3}>
        <Toolbar>
          <Button component={Link} to='/'>Audio Test</Button>
          {/*<Button component={Link} to='about'>About</Button>*/}
          <Typography style={{flexGrow: 1}}/>
          <Button component={Link} to='sign-in' color="primary" variant="outlined">Login</Button>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/sign-in" component={SignIn}/>
        <Route exact path="/sign-up" component={SignUp}/>
        <Redirect to="/not-found" />
      </Switch>
    </Suspense>
  );
}
