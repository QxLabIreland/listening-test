import React, {useContext} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {Button, Checkbox, FormHelperText, Grid, Link, TextField, Typography} from '@material-ui/core';
import {useStyles} from "./SignInUpStyles";
import {useFormik} from "formik";
import {email, maxLength, minLength, mustBeTrue, pipeValidator, required} from "../../shared/FormikValidator";
import Axios from "axios";
import {GlobalDialog} from "../../shared/ReactContexts";

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();
  const openDialog = useContext(GlobalDialog);
  // Form initialization
  const formik = useFormik({
    initialValues: {name: '', email: '', password: '', policy: false},
    onSubmit: values => Axios.post('/api/sign-up', values)
      .then(() => history.push('/user'), (reason) => openDialog(reason.response.data)),
    validate: pipeValidator({
      name: [required(), maxLength(128)],
      email: [email(), required()],
      password: [required(), minLength(6)],
      policy: [mustBeTrue()],
    })
  });

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.quoteContainer} item lg={5}>
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography className={classes.bio} variant="body2">
                Photo by David Kovalenko on Unsplash
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentHeader}/>
            <div className={classes.contentBody}>
              <form className={classes.form} onSubmit={formik.handleSubmit}>
                <Typography className={classes.title} variant="h2">
                  Create new account
                </Typography>
                <Typography color="textSecondary" gutterBottom className={classes.suggestion}>
                  Use your email to create new account
                </Typography>
                <TextField className={classes.textField} error={!!formik.errors.name} fullWidth
                           helperText={formik.errors.name} label="Your Name" name="name"
                           onChange={formik.handleChange} type="text" variant="outlined"/>

                <TextField className={classes.textField} error={!!formik.errors.email} fullWidth
                           helperText={formik.errors.email} label="Email address" name="email"
                           onChange={formik.handleChange} type="text" variant="outlined"/>

                <TextField className={classes.textField} error={!!formik.errors.password} fullWidth
                           helperText={formik.errors.password} label="Password" name="password"
                           onChange={formik.handleChange} type="password" variant="outlined"/>
                <div className={classes.policy}>
                  <Checkbox checked={formik.values.policy} className={classes.policyCheckbox}
                            color="primary" name="policy" onChange={formik.handleChange}/>
                  <Typography color="textSecondary" variant="body1">
                    I have read the{' '}
                    <Link color="primary" component={RouterLink} to="/terms-conditions" variant="h6" type="button">
                      Terms and Conditions
                    </Link>
                  </Typography>
                </div>
                {!!formik.errors.policy && <FormHelperText error>{formik.errors.policy}</FormHelperText>}
                <Button className={classes.signUpButton} color="primary" fullWidth
                        size="large" type="submit" variant="contained">
                  Sign up now
                </Button>
                <Typography color="textSecondary" variant="body1">
                  Have an account?{' '}
                  <Link component={RouterLink} to="/sign-in" variant="h6" type="button">
                    Sign in
                  </Link>
                </Typography>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
