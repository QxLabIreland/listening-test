import React, {Suspense} from 'react' // , lazy}
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import {Button} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {Link, Route, Switch} from 'react-router-dom';

import Home from "../views/Home";
import SignIn from "../views/auth/SignIn";
import SignUp from "../views/auth/SingUp";
import Loading from "../shared/components/Loading";

export default class MainLayout extends React.Component {
  render() {
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
          <Route path="/sign-in" component={SignIn}/>
          <Route path="/sign-up" component={SignUp}/>
        </Switch>
      </Suspense>
    );
  }
}
