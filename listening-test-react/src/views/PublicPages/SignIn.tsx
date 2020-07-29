import React, {useContext} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {Button, Grid, Link, TextField, Typography} from '@material-ui/core';
import {useFormik} from "formik";
import {email, minLength, pipeValidator, required} from "../../shared/FormikValidator";
import Axios from "axios";
import {GlobalDialog} from "../../shared/ReactContexts";
import {Md5} from 'ts-md5';
import {useSignInUpStyles} from "../SharedStyles";

export default function SignIn() {
  const classes = useSignInUpStyles();
  const history = useHistory();
  const openDialog = useContext(GlobalDialog);

  const formik = useFormik({
    initialValues: {email: '', password: ''},
    // Hash the password
    onSubmit: values => Axios.post('/api/login', {...values, password: Md5.hashStr(values.password)})
      .then(() => history.push('/user'), (reason) => {
        openDialog(reason.response.data);
      }),
    validate: pipeValidator({
      password: [required(), minLength(6)],
      email: [email(), required()]
    })
  });

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.quoteContainer} item lg={5}>
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography className={classes.bio} variant="body2">
                <span>Photo by Michael Soledad on Unsplash</span>
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentHeader}>
            </div>
            <div className={classes.contentBody}>
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
                  Login with email address
                </Typography>
                <TextField name="email" type="text" onChange={formik.handleChange} className={classes.textField}
                           fullWidth label="Email address" variant="outlined"
                           error={!!formik.errors.email} helperText={formik.errors.email}/>

                <TextField type="password" className={classes.textField} fullWidth label="Password" variant="outlined"
                           {...formik.getFieldProps('password')}
                           error={!!formik.errors.password} helperText={formik.errors.password}/>

                <Button className={classes.signInButton} color="primary" fullWidth size="large" type="submit"
                        variant="contained">
                  Sign in now
                </Button>
                <Typography color="textSecondary" variant="body1">
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/sign-up" variant="h6">
                    Sign up
                  </Link>
                </Typography>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
