import React, { Suspense } from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import { Button, Theme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
// , lazy}
import Toolbar from '@mui/material/Toolbar';
import { createStyles, makeStyles } from '@mui/styles';

import ConfirmEmail from '../views/PublicPages/ConfirmEmail';
import FindPassword from '../views/PublicPages/FindPassword';
import Home from '../views/PublicPages/Home';
import SignIn from '../views/PublicPages/SignIn';
import SignUp from '../views/PublicPages/SingUp';
import Loading from './components/Loading';
import NotFoundView from './components/NotFoundView';

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
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="find-password" element={<FindPassword />} />
        <Route path="confirm-email" element={<ConfirmEmail />} />
        {/*Not found page*/}
        <Route element={<NotFoundView />} />
      </Routes>
    </Suspense>
  );
}
