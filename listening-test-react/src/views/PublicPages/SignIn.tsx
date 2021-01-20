import React, {useContext} from 'react';
import {Link as RouterLink, useHistory, useLocation} from 'react-router-dom';
import {Button, Link, TextField, Typography} from '@material-ui/core';
import {useFormik} from "formik";
import {email, minLength, pipeValidator, required} from "../../shared/FormikValidator";
import Axios from "axios";
import {CurrentUser, GlobalDialog} from "../../shared/ReactContexts";
import {Md5} from 'ts-md5';
import {useSignInUpStyles} from "../SharedStyles";
import PublicFormLayout from "./PublicFormLayout";

export default function SignIn() {
  const classes = useSignInUpStyles();
  const history = useHistory();
  const openDialog = useContext(GlobalDialog);
  // Authorization hooks
  const {setCurrentUser} = useContext(CurrentUser);
  const location = useLocation();

  const formik = useFormik({
    initialValues: {email: (location.state as any)?.email || '', password: ''},
    // Hash the password
    onSubmit: values => Axios.post('/api/login', {...values, password: Md5.hashStr(values.password)})
      .then((res) => {
        // Set current user and navigate to dashboard
        setCurrentUser(res.data);
        // Get state where user has been blocked by authentication
        const from = (location.state as any)?.from || { pathname: '/user' };
        history.push(from);
      }, (reason) => {
        openDialog(reason.response.data);
      }),
    validate: pipeValidator({
      password: [required(), minLength(6)],
      email: [email(), required()]
    })
  });

  return <PublicFormLayout classes={classes}>
    <form className={classes.form} onSubmit={formik.handleSubmit}>
      <Typography className={classes.title} variant="h2">
        Sign in
      </Typography>
      {/*<Typography color="textSecondary" gutterBottom>
        Sign in with social media
      </Typography>
      <Grid className={classes.socialButtons} container spacing={2}>
        <Grid item>
          <Button color="primary" onClick={handleSignIn} size="large" variant="contained">
            Login with Facebook
          </Button>
        </Grid>
        <Grid item>
          <Button onClick={handleSignIn} size="large" variant="contained">
            Login with Google
          </Button>
        </Grid>
      </Grid>*/}
      <Typography className={classes.suggestion} gutterBottom color="textSecondary" variant="body1">
        Login with your email address.
      </Typography>
      <TextField name="email" type="text" onChange={formik.handleChange} value={formik.values.email} className={classes.textField}
                 fullWidth label="Email Address" variant="outlined"
                 error={!!formik.errors.email} helperText={formik.errors.email}/>

      <TextField type="password" className={classes.textField} fullWidth label="Password" variant="outlined"
                 {...formik.getFieldProps('password')}
                 error={!!formik.errors.password} helperText={formik.errors.password}/>

      <Button className={classes.signInUpButton} color="primary" fullWidth size="large" type="submit"
              variant="contained">
        Sign in now
      </Button>
      <Typography color="textSecondary" variant="body1">
        Don't have an account?{' '}
        <Link component={RouterLink} to="/sign-up" variant="h6">Sign up here</Link>
      </Typography>
      <Typography color="textSecondary" variant="body1">
        <Link component={RouterLink} to="/find-password" variant="body1">Forget password</Link>
      </Typography>
      {/*<Typography variant="body2" gutterBottom color="textSecondary" style={{marginTop: 8}}>
        We are in closed beta! Contact <a href="mailto:golisten@ucd.ie" style={{color: 'black'}}>golisten@ucd.ie</a> to discuss access
      </Typography>*/}
    </form>
  </PublicFormLayout>
}
